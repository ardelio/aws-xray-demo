const fetch = require('node-fetch');

const { AWS } = require('./instrumented-modules');
const extractObjectDetailsFromEvent = require('./extract-object-details-from-event');
const { captureAsyncFunction, captureFunction } = require('./tracing-instrumentation');

exports.handler =  async function(event) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))

  const partialS3ObjectDetails = extractObjectDetailsFromEvent(event);

  const filledS3ObjectsDetails = await supplimentWithS3Objects(partialS3ObjectDetails);

  await demonstrateInstrumentingHttps();

  await demonstrateInstrumentingAsyncFunction();

  demonstrateInstrumentingFunction();

  await saveToDatabase(filledS3ObjectsDetails);
}

async function supplimentWithS3Objects(objectDetails) {
  const s3 = new AWS.S3();

  return Promise.all(objectDetails.map(async objectDetail => {
    const params = {
      Bucket: objectDetail.bucket,
      Key: objectDetail.key,
    };

    const object = await s3.getObject(params).promise();

    return { ...objectDetail, object };
  }));
}

async function saveToDatabase(objectDetails) {
  const dynamodb = new AWS.DynamoDB();

  return Promise.all(objectDetails.map(objectDetail => {
    const params = {
      Item: {
        filename: {
          S: `${objectDetail.bucket}/${objectDetail.key}`,
        },
        lastModified: {
          S: objectDetail.object.LastModified.toISOString()
        },
        body: {
          B: objectDetail.object.Body
        }
      },
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };

    return dynamodb.putItem(params).promise();
  }));
}

function demonstrateInstrumentingHttps() {
  return fetch('https://google.com');
}

async function demonstrateInstrumentingAsyncFunction() {
  const functionToInstrument = async (firstLogComment, secondLogComment, timeInMilliseconds) => {
    console.log(firstLogComment);

    await new Promise(resolve => setTimeout(resolve, timeInMilliseconds));

    console.log(secondLogComment);
  };

  return captureAsyncFunction('demonstrate-instrumenting-an-async-function', functionToInstrument, ['my first log', 'my second log', 5000]);
}

function demonstrateInstrumentingFunction() {
  const logAllItems = (items) => {
    items.forEach(item => {
      captureFunction('logging-to-console', console.log, ['logging item: ', item]);
    });
    return items.length;
  };
  const items = [
    'first item',
    'second item',
  ];
  const numberOfItemsLogged = captureFunction('demonstrate-instrumenting-a-function', logAllItems, [items]);
  console.log('numberOfItemsLogged:', numberOfItemsLogged);
}