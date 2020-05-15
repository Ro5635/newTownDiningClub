import { logger, docClient, environment } from '../../../infrastructure/configuration';

const { NTDC_TABLE_NAME } = environment;

const messageToItem = (message) => {
  const {
    messageId,
    vendorId,
    messageType,
  } = message;

  return {
    PK: `Message_${messageId}`,
    SK: `messageType_${messageType}`,
    'GSI1-PK': `Vendor_${vendorId}`,
    // TODO: Clean this forcing of creation time up
    'GSI1-SK': `Message_${Date.now()}`,
    ...message,
  };
};

const saveMessage = async ({
  messageId,
  vendorId,
  targetEmailAddress,
  messageHtmlBody,
  messageTextBody,
  messageType,
  messageSubject,
  messageDispatched,
  messageDispatchedAt,
  version = 0,
}) => {
  try {
    logger.info('Saving new Message to persistence');
    const newVersion = version + 1;
    const messageItem = messageToItem({
      messageId,
      vendorId,
      targetEmailAddress,
      messageHtmlBody,
      messageTextBody,
      messageType,
      messageSubject,
      messageDispatched,
      messageDispatchedAt,
      version: newVersion,
    });
    const params = {
      TableName: NTDC_TABLE_NAME,
      Item: messageItem,
    };

    const dynamoDbResponse = await docClient.put(params).promise();
    logger.info(`DynamoDB put succeeded with response: ${JSON.stringify(dynamoDbResponse)}`);
  } catch (error) {
    logger.error(`failed to save to DynamoDb with error: ${error}`);
    throw new Error('Failed to save Message');
  }
};

export default saveMessage;
