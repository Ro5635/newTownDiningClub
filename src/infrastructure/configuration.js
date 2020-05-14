import aws from 'aws-sdk';
import { newLogger } from '@travel-cloud/simple-lambda-logger';
import errors from './utilities/errors';
import validate from './utilities/joi_validation_with_throws';

const {
  REGION,
  NTDC_TABLE_NAME,
  VENDOR_EVENT_BUS_NAME,
} = process.env;

const logLevel = 'DEBUG';
const isRunningLocally = process.env.AWS_SAM_LOCAL === 'true';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': 'content-type, Authorization',
};

const environment = {
  REGION,
  NTDC_TABLE_NAME,
  VENDOR_EVENT_BUS_NAME,
};

const logger = newLogger(logLevel);

if (isRunningLocally) {
  aws.config.update({
    region: 'local',
    endpoint: 'http://dynamodb:8000/',
  });
  // Provide Local versions when running locally
  environment.NTDC_TABLE_NAME = 'newTownDiningClubServiceTable';
} else {
  aws.config.update({
    region: REGION,
  });
}

const docClient = new aws.DynamoDB.DocumentClient();
const eventBridge = new aws.EventBridge({ apiVersion: '2015-10-07' });
const emailService = new aws.SES({ apiVersion: '2010-12-01' });
const sqs = new aws.SQS({ apiVersion: '2012-11-05' });

const utilities = {
  validate,
};

export {
  aws,
  docClient,
  eventBridge,
  emailService,
  sqs,
  corsHeaders,
  logger,
  utilities,
  errors,
  environment,
};
