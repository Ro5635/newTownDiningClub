import {
  corsHeaders,
  errors,
  logger,
} from '../../../infrastructure/configuration';
import createVendorCommandService from '../../../application/command/vendor/create_vendor';

const { ValidationConstraintError } = errors;

export const createVendor = async ({
  body = {},
}) => {
  try {
    logger.info('Handling call to POST /vendor');
    const parsedBody = JSON.parse(body);
    const { vendor } = parsedBody;

    const newVendor = await createVendorCommandService(vendor);

    await logger.close();
    return {
      statusCode: 200,
      body: JSON.stringify(newVendor),
      headers: corsHeaders,
    };
  } catch (error) {
    logger.error(`Error caught in rest adapter, ${error}`);

    if (error instanceof ValidationConstraintError) {
      logger.error('Caught ValidationConstraintError');
      logger.error(error.message);
      logger.error(error.stack);
      logger.error('Responding 400 Invalid Vendor Supplied');
      await logger.close();
      return {
        statusCode: 400,
        headers: corsHeaders,
      };
    }

    logger.error('Unrecognised error');
    logger.error(error.message);
    logger.error(error.stack);
    logger.error('Responding StatusCode 500');
    return {
      statusCode: 500,
      headers: corsHeaders,
    };
  }
};

export default {};
