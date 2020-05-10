import createVendor from '../../../domain/vendor/create_vendor';
import createCard from '../../../adapters/zapier/trello/create_card';
import { logger } from '../../../infrastructure/configuration';

const addVendorToTrelloList = async ({ vendor, listName }) => {
  try {
    logger.info(`addVendorToTrelloListCommand Service adding card to list:${listName}`);
    const vendorCdm = await createVendor(vendor);

    const cardTitle = `${vendorCdm.name}`;
    const cardContents = {
      ...vendorCdm,
    };
    await createCard({ cardContents, cardTitle, listName });
  } catch (error) {
    // TODO: Catch the validation exception from vendor cdm...
    logger.error('Caught error in create Trello card command service');
    logger.error(error);
  }
};

export default addVendorToTrelloList;
