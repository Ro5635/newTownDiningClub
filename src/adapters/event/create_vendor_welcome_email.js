import { logger } from '../../infrastructure/configuration';
import sendVendorWelcomeEmailCommandService from '../../application/command/messages/create_vendor_welcome_email';

export const handler = async ({ detail = {} }) => {
  try {
    logger.info('sendVendorWelcomeEmail Function Invoked');
    logger.debug('Invoked with event detail:');
    logger.debug(JSON.stringify(detail));

    const { vendor } = detail;
    const { vendorId } = vendor;

    await sendVendorWelcomeEmailCommandService({ vendorId });

    logger.info('Execution Of sendVendorWelcomeEmail Completed Successfully');
    await logger.close();
  } catch (error) {
    logger.error('Failure In Execution Of sendVendorWelcomeEmail');
    logger.error(error.message);
    logger.error(error.stack);
    await logger.close();
  }
};

export default {};
