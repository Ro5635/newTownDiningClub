import {
  logger, errors, sqs, environment,
} from '../../../infrastructure/configuration';
import readVendor from '../../../adapters/persistence/vendor_repository/read_vendor';
import createVendor from '../../../domain/vendor/create_vendor';
import saveMessage from '../../../adapters/persistence/message_repository/save_message';
import { createMessage } from '../../../domain/messages/message';

const { EMAIL_DISPATCH_QUEUE } = environment;
const { ExecutionFailedError } = errors;

const sendVendorWelcomeEmailCommandService = async ({ vendorId }) => {
  try {
    const { vendor: vendorItem } = await readVendor({ vendorId });
    const vendor = await createVendor(vendorItem);

    // TODO: Relocate hard coded email template strings away from application layer
    const messageHtmlBody = `
        <h2>Greetings ${vendor.name}!</h2>
        
        Welcome to New Town Dinning Club, this is a place that cooks food. 🙌 
        <br>
        Here are some resources to get you started:
        
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Get Started!</a>
    
    `;
    const messageTextBody = 'content...';

    logger.debug(`Saving email content to persistence for transmission, emailHtmlBody:${messageHtmlBody}`);
    logger.info('Creating new Email Message');

    const message = await createMessage({
      vendorId,
      targetEmailAddress: vendor.contactEmail,
      messageHtmlBody,
      messageTextBody,
      messageType: 'email',
      messageSubject: 'Welcome To New Town Dining Club',
    });

    logger.info(`Saving new Email Message to Persistence With MessageId:${message.messageId}`);
    await saveMessage(message);

    logger.info('Adding Message To Email Dispatch Queue');
    const { messageId } = message;

    const emailDispatchCommandBody = {
      commandType: 'emailDispatchCommand',
      messageId,
    };

    const queueMessageParams = {
      MessageBody: JSON.stringify(emailDispatchCommandBody),
      QueueUrl: EMAIL_DISPATCH_QUEUE,
    };
    const sqsResponse = await sqs.sendMessage(queueMessageParams).promise();
    logger.debug('Response from Request to Add message to Queue:');
    logger.info(JSON.stringify(sqsResponse));

    logger.info('Email Created Successfully');
  } catch (error) {
    logger.error('Failure in sendVendorWelcomeEmailCommandService');
    logger.error(error.message);
    logger.error(error.stack);
    throw new ExecutionFailedError('Failed complete send of vendor welcome email');
  }
};


export default sendVendorWelcomeEmailCommandService;
