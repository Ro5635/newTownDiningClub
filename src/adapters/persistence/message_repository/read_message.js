import {
    logger, errors, docClient, environment,
} from '../../../infrastructure/configuration';

const { NonExistentItemError } = errors;
const { NTDC_TABLE_NAME } = environment;

const itemToMessage = (messageItem) => {
    const {
        PK, SK, 'GSI1-PK': GSI1PK, 'GSI1-SK': GSI1SK, ...message
    } = messageItem;
    return { ...message };
};

const readMessage = async ({ messageId }) => {
    try {
        logger.info(`Attempting to read messageId:${messageId} from DB`);

        const params = {
            TableName: NTDC_TABLE_NAME,
            Key: {
                PK: `Message_${messageId}`,
                SK: 'MessageType_Email',
            },
            Limit: 1,
            ReturnConsumedCapacity: 'TOTAL',
        };

        const { Item, ConsumedCapacity } = await docClient.get(params).promise();
        logger.info(`DynamoDB get succeeded with response: ${JSON.stringify(ConsumedCapacity)}`);
        if (!Item) throw new NonExistentItemError('No Matching MessageItem Found In DB');
        const message = itemToMessage(Item);
        return {
            message,
        };
    } catch (error) {
        if (error instanceof NonExistentItemError) {
            logger.info('Unable to get the requested resource from the DB');
            throw error;
        }

        logger.error('failed to get Message from persistence');
        logger.error(error);
        throw new Error('Failed to read Message');
    }
};

export default readMessage;
