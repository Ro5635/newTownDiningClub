import { logger, docClient, environment } from '../../../infrastructure/configuration';

const { NTDC_TABLE_NAME } = environment;

const vendorToItem = ({
  vendorId,
  name,
  vendorState,
  cuisineType,
  contactEmail,
  contactPhone,
  michelinStars,
  version,
}) => ({
  PK: `Vendor_${vendorId}`,
  SK: 'Detail',
  'GSI1-PK': 'Vendor',
  'GSI1-SK': vendorState,
  vendorId,
  name,
  cuisineType,
  contactEmail,
  contactPhone,
  michelinStars,
  version,
});

const saveVendor = async ({
  vendorId,
  name,
  vendorState,
  cuisineType,
  contactEmail,
  contactPhone,
  michelinStars,
  version = 0,
}) => {
  logger.info('Saving new vendor to persistence');

  try {
    const newVersion = version + 1;
    const vendorItem = vendorToItem({
      vendorId, name, vendorState, cuisineType, contactEmail, contactPhone, michelinStars, version: newVersion,
    });
    const params = {
      TableName: NTDC_TABLE_NAME,
      Item: vendorItem,
    };

    const dynamoDbResponse = await docClient.put(params).promise();
    logger.info(`DynamoDB put succeeded with response: ${JSON.stringify(dynamoDbResponse)}`);
  } catch (error) {
    logger.error(`failed to save to DynamoDb with error: ${error}`);
    throw new Error('Failed to save vendor');
  }
};

export default saveVendor;
