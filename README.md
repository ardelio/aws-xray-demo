# AWS XRay Demonstration

A demonstration on tracing with AWS XRay. The purpose of the demonstration is to show the effectivenss of applying tracing to a system that incorporates multiple AWS Services.

In this case, the system contains the following resources:

- AWS S3 Bucket
- AWS SQS Standard Message Queue
- AWS Lambda Function
- AWS DynamoDB Table

The workflow being traced is:

```
Object -:upload:-> S3 Bucket -:messages:-> SQS Queue -:triggers:-> Lambda Function -:puts:-> DynamoDB Table
```

## Setup

Create a file that contains the bucket name of the bucket used for deploying your lambda function to:

```bash
echo "my-bucket-name" > .bucket-name
```

## Deployment

Ensure you are logged into the relevant AWS account.

> Note: If deploying for the first time, remove (or comment out) the NotificationConfiguration property on the S3 bucket for the first deploy. You can then add back in and deploy a second time. This is a known problem with applying NotificationConfigurations on a bucket to a target resource in the same stack.

Then run the command:

```
make deploy
```