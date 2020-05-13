import { logger } from '../../infrastructure/configuration';
import addVendorToTrelloList from '../../application/command/vendor/add_vendor_to_trello_list';

export const handler = async ({ detail = {} }) => {
  try {
    logger.info('vendorCreatedAddVendorToTrello Invoked');
    const { vendor } = detail;
    logger.debug('Received vendor:');
    logger.debug(JSON.stringify(vendor));

    await addVendorToTrelloList({ vendor, listName: 'newVendors' });
    logger.info('Execution of vendorCreatedAddVendorToTrello completed Successfully');
    await logger.close();

  } catch (error) {
    logger.error('Error caught in execution of vendorCreatedAddVendorToTrello');
    logger.error(error.message);
    logger.error(error.stack);
    await logger.close();
  }
};

export default {};
