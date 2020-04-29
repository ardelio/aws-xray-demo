const AWSXRay = require('aws-xray-sdk');
const AWS = require('aws-sdk');

module.exports = AWSXRay.captureAWS(AWS);