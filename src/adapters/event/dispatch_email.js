import { logger, errors, environment } from '../../infrastructure/configuration';
import dispatchEmailCommandService from '../../application/command/messages/dispatch_email';
import deleteSQSMessage from '../aws/sqs/delete_message';

const { EMAIL_DISPATCH_QUEUE } = environment;
const { InvalidOperationError } = errors;

const dispatchEmail = async ({ messageId, receiptHandle }) => {
  try {
    await dispatchEmailCommandService({ messageId });
    logger.info(`Deleting emailDispatchCommand Event From Queue with receiptHandle:${receiptHandle}`);
    await deleteSQSMessage({ queueURL: EMAIL_DISPATCH_QUEUE, receiptHandle });
  } catch (error) {
    logger.error(`Dispatch Of An messageId:${messageId} Failed`);
    throw error;
  }
};

const extractParamsFromRecord = ({ record }) => {
  logger.debug('Extracting parameters from record');
  const { body, receiptHandle } = record;
  const messageDispatchCommand = JSON.parse(body);
  const { commandType, messageId } = messageDispatchCommand;
  logger.debug(`Extracted messageId:${messageId}, commandType:${commandType}, receiptHandle:${receiptHandle}`);
  return {
    messageId,
    commandType,
    receiptHandle,
  };
};

export const handler = async ({ Records = [] }) => {
  try {
    logger.info('Dispatch Email Function Invoked');
    logger.info(`Function Invoked with ${Records.length} records`);

    logger.debug('Dispatch Queue RecordsPayload:');
    logger.debug(JSON.stringify(Records));

    const emailDispatchPromises = Records.map(async (record) => {
      const {
        messageId,
        commandType,
        receiptHandle,
      } = extractParamsFromRecord({ record });

      if (commandType === 'emailDispatchCommand') {
        await dispatchEmail({ messageId, receiptHandle });
        Promise.resolve();
      } else {
        Promise.reject(new InvalidOperationError('Unknown Message Dispatch Type'));
      }
    });

    // It is necessary to add a catch to each promise as the Promise.all is fail fast
    const safeEmailDispatchPromises = emailDispatchPromises.map((promise) => promise.catch(((error) => {
      logger.error('Caught Failure From an Email Dispatch');
      return error;
    })));

    const emailDispatchResults = await Promise.all(safeEmailDispatchPromises);

    // We need to step through all of the results and check to see if there was a caught error
    emailDispatchResults.forEach((dispatchResult) => {
      if (dispatchResult instanceof Error) {
        throw dispatchResult;
      }
    });

    logger.info('All Records Resolved');
    await logger.close();
    return { dispatched: Records };
  } catch (error) {
    logger.error('Failed to handle 1 or more records in dispatchEmail Event handler');
    logger.error(error.message);
    logger.error(error.stack);
    await logger.close();

    // Need to throw the error to ensure that the message is not removed from the queue
    // automagicaly by lambda/aws/magic
    return Promise.reject(error);
  }
};

export default {};
