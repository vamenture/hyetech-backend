import Joi from 'joi';

export const createValidation = Joi.object({
  role_name: Joi.string().required(),
  key: Joi.string().required(),
  is_active: Joi.boolean().default(true),
});

export const updateValidation = Joi.object({
  _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  role_name: Joi.string().optional(),
  key: Joi.string().optional(),
  is_active: Joi.boolean().optional(),
});

export const getValidation = Joi.object({
  _id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});
