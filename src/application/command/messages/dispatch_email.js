import { logger, errors } from '../../../infrastructure/configuration';
import readMessage from '../../../adapters/persistence/message_repository/read_message';
import { createMessage, markMessageAsDispatched } from '../../../domain/messages/message';
import sendEmail from '../../../adapters/aws/ses/send_email';
import saveMessage from '../../../adapters/persistence/message_repository/save_message';

const { ExecutionFailedError } = errors;

const dispatchEmailCommandService = async ({ messageId }) => {
  try {
    logger.info(`Dispatch Email Command Service Called to Dispatch messageId:${messageId}`);

    const { message: messageItem } = await readMessage({ messageId });
    const message = await createMessage(messageItem);

    logger.debug(`Dispatching Message:${JSON.stringify(message)}`);
    await sendEmail(message);
    logger.info(`MessageId:${messageId} Dispatch Completed`);


    logger.info(`Marking MessageId:${messageId} as Dispatched`);
    const updatedMessage = await markMessageAsDispatched({ message });
    logger.info('Saving Updated Message To Persistence');
    await saveMessage(updatedMessage);
  } catch (error) {
    logger.error('Failure Caught In Dispatch Email Command Service');
    logger.error(error.message);
    logger.error(error.stack);
    throw new ExecutionFailedError(`Failed to dispatch email message with MessageId:${messageId}`);
  }
};

export default dispatchEmailCommandService;
