import {
  logger, errors, docClient, environment,
} from '../../../infrastructure/configuration';

const { NonExistentItemError } = errors;
const { NTDC_TABLE_NAME } = environment;

const itemToVendor = (vendorItem) => {
  const {
    PK, SK, 'GSI1-PK': GSI1PK, 'GSI1-SK': vendorState, ...vendor
  } = vendorItem;
  return { ...vendor, vendorState };
};

const readVendor = async ({ vendorId }) => {
  try {
    logger.info(`Attempting to read vendorId:${vendorId} from DB`);

    const params = {
      TableName: NTDC_TABLE_NAME,
      Key: {
        PK: `Vendor_${vendorId}`,
        SK: 'Detail',
      },
      Limit: 1,
      ReturnConsumedCapacity: 'TOTAL',
    };

    const { Item, ConsumedCapacity } = await docClient.get(params).promise();
    logger.info(`DynamoDB get succeeded with response: ${JSON.stringify(ConsumedCapacity)}`);
    if (!Item) throw new NonExistentItemError('No Matching VendorItem Found In DB');
    const vendor = itemToVendor(Item);
    return {
      vendor,
    };
  } catch (error) {
    if (error instanceof NonExistentItemError) {
      logger.info('Unable to get the requested resource from the DB');
      throw error;
    }

    logger.error('failed to get vendor from persistence');
    logger.error(error);
    throw new Error('Failed to read Vendor');
  }
};

export default readVendor;
