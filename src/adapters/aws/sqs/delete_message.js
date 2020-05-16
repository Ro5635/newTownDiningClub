import { logger, sqs } from '../../../infrastructure/configuration';

const deleteSQSMessage = async ({ receiptHandle, queueURL }) => {
  try {
    logger.info(`Deleting SQS receiptHandle:${receiptHandle} from SQS Queue:${queueURL}`);

    const params = {
      QueueUrl: queueURL,
      ReceiptHandle: receiptHandle,
    };
    await sqs.deleteMessage(params).promise();
  } catch (error) {
    logger.error(`Failed to delete message from SQSQueue:${queueURL} with receiptHandle:${receiptHandle}`);
    throw error;
  }
};

export default deleteSQSMessage;
