import { v4 as uuidv4 } from 'uuid';
import Joi from '@hapi/joi';
import { utilities } from '../../infrastructure/configuration';

const { validate } = utilities;

const vendorDefinition = Joi.object().keys({
  vendorId: Joi.string().required(),
  name: Joi.string().required().min(1).max(300),
  vendorState: Joi.string().required().min(1).max(300),
  cuisineType: Joi.string().required().min(1).max(300),
  contactEmail: Joi.string().required().min(1).max(300),
  contactPhone: Joi.string().required().min(1).max(30),
  michelinStars: Joi.number().integer().min(0).max(3),
  version: Joi.number().integer().min(0),
});

export const createVendor = async ({
  vendorId = uuidv4(),
  name,
  vendorState = 'pendingReview',
  cuisineType,
  contactEmail,
  contactPhone,
  michelinStars,
  version = 0,
}) => validate({
  vendorId,
  name,
  vendorState,
  cuisineType,
  contactEmail,
  contactPhone,
  michelinStars,
  version,
}, vendorDefinition);

export const applyVendorState = async ({ vendor, newVendorState }) => {
  const newVendor = { ...vendor, vendorState: newVendorState };
  return { vendor: newVendor };
};

export default {
  createVendor,
  applyVendorState,
};
