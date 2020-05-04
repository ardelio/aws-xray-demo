const AWSXRay = require('aws-xray-sdk');

exports.AWS = AWSXRay.captureAWS(require('aws-sdk'));

AWSXRay.captureHTTPsGlobal(require('https'));
AWSXRay.captureHTTPsGlobal(require('http'));