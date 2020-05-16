import { logger, emailService } from '../../../infrastructure/configuration';

const sendEmail = async ({
  targetEmailAddress, messageHtmlBody, messageTextBody, messageSubject,
}) => {
  try {
    logger.info('Sending Email Using AWS SES');
    logger.info(`Sending to Address:${targetEmailAddress}`);
    // Create sendEmail params
    const params = {
      Destination: { /* required */
        ToAddresses: [
          `${targetEmailAddress}`,
        ],
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
            Charset: 'UTF-8',
            Data: `${messageHtmlBody}`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: `${messageTextBody}`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `${messageSubject}`,
        },
      },
      Source: 'robot@robertcurran.uk',
    };

    await emailService.sendEmail(params).promise();

    logger.info('Successfully Sent Email');
  } catch (error) {
    logger.error('Failure In Sending Email');
    throw error;
  }
};


export default sendEmail;
