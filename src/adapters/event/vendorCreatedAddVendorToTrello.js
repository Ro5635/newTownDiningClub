import { logger } from '../../infrastructure/configuration';
import addVendorToTrelloList from '../../application/command/vendor/add_vendor_to_trello_list';

export const handler = async ({ detail }) => {
  try {
    logger.info('vendorCreatedEventHandler Called');
    logger.debug('received event:');
    logger.debug(JSON.stringify(detail));

    await addVendorToTrelloList({ vendor: detail, listName: 'newVendors' });
  } catch (error) {
    logger.error('Error caught in event handler');
    logger.error(error.message);
    logger.error(error.stack);
  }
};

export default {};
