const AWS = require('./aws-sdk');
const extractObjectDetailsFromEvent = require('./extractObjectDetailsFromEvent');

exports.handler =  async function(event) {
  console.log("EVENT: \n" + JSON.stringify(event, null, 2))

  const partialS3ObjectDetails = extractObjectDetailsFromEvent(event);

  const filledS3ObjectsDetails = await supplimentWithS3Objects(partialS3ObjectDetails);

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