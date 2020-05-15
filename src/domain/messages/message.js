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
  messageDispatched: Joi.string().valid('true', 'false', 'failed').required(),
  messageDispatchedAt: Joi.number().min(0),
  version: Joi.number().integer().min(0),
});

export const createMessage = async ({
  messageId = uuidv4(),
  vendorId,
  targetEmailAddress,
  messageHtmlBody,
  messageTextBody,
  messageType,
  messageSubject,
  messageDispatched = 'false',
  messageDispatchedAt,
  version = 0,
}) => validate({
  messageId,
  vendorId,
  targetEmailAddress,
  messageHtmlBody,
  messageTextBody,
  messageType,
  messageSubject,
  messageDispatched,
  messageDispatchedAt,
  version,
}, emailMessageDefinition);

export const markMessageAsDispatched = async ({ message, markDispatchedAt = Date.now() }) => ({
  ...message,
  messageDispatched: true,
  messageDispatchedAt: markDispatchedAt,
});


export default {
  createMessage,
  markMessageAsDispatched,
};
