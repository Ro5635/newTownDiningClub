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
  logger.info('Handling call to POST /vendor');
  try {
    const parsedBody = JSON.parse(body);
    const { vendor } = parsedBody;

    const newVendor = await createVendorCommandService(vendor);

    return {
      statusCode: 200,
      body: JSON.stringify(newVendor),
      headers: corsHeaders,
    };
  } catch (error) {
    logger.error(`Error caught in rest adapter, ${error}`);

    if (error instanceof ValidationConstraintError) {
      logger.error('Caught ValidationConstraintError');
      logger.error(error.stack);
      logger.error('Responding 400 Invalid Vendor Supplied');
      await logger.close();
      return {
        statusCode: 400,
        headers: corsHeaders,
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
    };
  }
};

export default {};
