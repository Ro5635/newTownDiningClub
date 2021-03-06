import {
  corsHeaders,
  logger,
  errors,
} from '../../../../infrastructure/configuration';
import setVendorStateCommandService from '../../../../application/command/vendor/set_vendor_state';

const { InvalidOperationError, ExecutionFailedError } = errors;

const extractVendorIdFromTrelloDump = ({ trelloDump }) => {
  // So turns out putting things to Trello is all sunshine and butterflys
  // but when you ask for it back it just craps in your freshly washed hand.
  // I have wrapped the vendorId in '~~^^' so that I can extract it 😡
  logger.info('Extracting vendorId from Trello card');
  return trelloDump.split('~~^^')[1];
};

const getVendorIdAndStateForTrelloSource = ({ body }) => {
  const { vendorDetail, vendorState } = JSON.parse(body);
  logger.info('Call from Trello source with vendorState:');
  logger.info(vendorState);
  logger.info('And vendorDetail');
  logger.info(vendorDetail);

  // Need to clean up the mess that trello has dumped here
  const vendorId = extractVendorIdFromTrelloDump({ trelloDump: vendorDetail });
  logger.info(`extracted vendorId:${vendorId}`);
  return { vendorId, vendorState };
};

const getVendorIdAndState = ({ body, source }) => {
  if (source === 'trello') {
    return getVendorIdAndStateForTrelloSource({ body });
  }
  throw new InvalidOperationError('Unrecognised source, cannot proceed');
};

export const vendorUpdatedWebHookHandler = async ({
  body = {},
  queryStringParameters = {},
}) => {
  try {
    logger.info('Handling call to POST /webhooks/vendors');

    const { source } = queryStringParameters;
    logger.info(`Using source:${source}`);

    const { vendorId, vendorState } = getVendorIdAndState({ body, source });
    await setVendorStateCommandService({ vendorState, vendorId });

    logger.info('restAdapter returning success 201 to caller');
    await logger.close();
    return {
      statusCode: 201,
      headers: corsHeaders,
    };
  } catch (error) {
    if (error instanceof InvalidOperationError) {
      logger.error('Invalid Request');
      logger.error(error.message);
      logger.error(error.stack);
      await logger.close();
      return {
        statusCode: 400,
        headers: corsHeaders,
      };
    } if (error instanceof ExecutionFailedError) {
      logger.error('Execution failed, Application unable to satisfy request');
      logger.error(error.message);
      logger.error(error.stack);
      logger.error('Returning StatusCode 500 to caller');
      await logger.close();
      return {
        statusCode: 500,
        headers: corsHeaders,
      };
    }

    logger.error('Unknown Error Caught In Rest Adapter');
    logger.error(error.message);
    logger.error(error.stack);
    logger.error('Returning Status 500 to caller');
    await logger.close();
    return {
      statusCode: 500,
      headers: corsHeaders,
    };
  }
};


export default {};
