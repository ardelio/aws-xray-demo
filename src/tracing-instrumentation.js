const AWSXRay = require('aws-xray-sdk');

exports.captureAsyncFunction = async function(subsegmentName, functionToInstrument, arguments) {
  return AWSXRay.captureAsyncFunc(subsegmentName, async subsegment => {
    const result = await functionToInstrument(...arguments);
    subsegment.close();
    return result;
  });
};

exports.captureFunction = function(subsegmentName, functionToInstrument, arguments) {
  return AWSXRay.captureFunc(subsegmentName, subsegment => {
    const result = functionToInstrument(...arguments);
    subsegment.close();
    return result;
  });
};