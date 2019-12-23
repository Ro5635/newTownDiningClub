import aws from 'aws-sdk';

const { REGION } = process.env;
const isRunningLocally = process.env.AWS_SAM_LOCAL === 'true';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': 'content-type, Authorization',
};

const environment = {
};

if (isRunningLocally) {
  aws.config.update({
    region: 'local',
    endpoint: 'http://dynamodb:8000/',
  });
  // Provide Local versions when running locally
  // environment.EXAMPLE_TABLE_NAME = 'exampleTableName';
} else {
  aws.config.update({
    region: REGION,
  });
}

const docClient = new aws.DynamoDB.DocumentClient();

export {
  aws,
  docClient,
  corsHeaders,
  environment,
};
