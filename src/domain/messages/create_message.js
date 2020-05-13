import { v4 as uuidv4 } from 'uuid';
import Joi from '@hapi/joi';
import { utilities } from '../../infrastructure/configuration';

const { validate } = utilities;

// TODO: Update this to handle both the email and sms message types

const emailMessageDefinition = Joi.object().keys({
  messageId: Joi.string().required(),
  vendorId: Joi.string().required(),
  targetEmailAddress: Joi.string().required().min(1).max(300),
  messageHtmlBody: Joi.string().required().min(1).max(3000),
  messageTextBody: Joi.string().required().min(1).max(3000),
  messageType: Joi.string().valid('email').required(),
  messageSubject: Joi.string().required().min(1).max(300),
  version: Joi.number().integer().min(0),
});

const createMessage = async ({
  messageId = uuidv4(),
  vendorId,
  targetEmailAddress,
  messageHtmlBody,
  messageTextBody,
  messageType,
  messageSubject,
  version = 0,
}) => validate({
  messageId,
  vendorId,
  targetEmailAddress,
  messageHtmlBody,
  messageTextBody,
  messageType,
  messageSubject,
  version,
}, emailMessageDefinition);


export default createMessage;
