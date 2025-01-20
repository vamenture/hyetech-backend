import Joi from 'joi';

export const createValidation = Joi.object({
  user_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  primary_email: Joi.string().email().required(),
  secondary_email: Joi.string().email().optional(),
  address: Joi.object().optional(),
  social_media: Joi.array().items(Joi.object()).optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  title: Joi.string().required(),
  sub_title: Joi.string().optional(),
  description: Joi.string().optional(),
  is_active: Joi.boolean().default(true),
});

export const updateValidation = Joi.object({
  _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  primary_email: Joi.string().email().optional(),
  secondary_email: Joi.string().email().optional(),
  address: Joi.object().optional(),
  social_media: Joi.array().items(Joi.object()).optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  title: Joi.string().optional(),
  sub_title: Joi.string().optional(),
  description: Joi.string().optional(),
  is_active: Joi.boolean().optional(),
});

export const getValidation = Joi.object({
  _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});
