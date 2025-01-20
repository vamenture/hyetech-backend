import Joi from 'joi';

// Sign Up Validation Schema
export const signUpValidationSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().optional(),
  password: Joi.string().min(8).required(),
  email: Joi.string()
    .email({ minDomainSegments: 1, tlds: { allow: ['com'] } })
    .required()
    .label('Email'),
  email_verified: Joi.boolean().default(false),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  secondary_email: Joi.string().email().optional().allow(null),
  login_type: Joi.string().valid('email', 'sso').default('email'),
  role: Joi.string()
    .valid('user', 'admin', 'super-admin')
    .default('user'),
  otp: Joi.string().optional().allow(null),
  expiration_time: Joi.date().optional().allow(null),
  avatar: Joi.string().uri().optional().allow(null),
  token: Joi.string().optional().allow(null),
  is_verified: Joi.boolean().default(false),
  is_active: Joi.boolean().default(true),
});

// Login Validation Schema
export const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 1, tlds: { allow: ['com'] } })
    .required()
    .label('Email'),
  password: Joi.string().min(8).required(),
});

// Forget Password Validation Schema
export const forgetPasswordValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 1, tlds: { allow: ['com'] } })
    .required()
    .label('Email'),
});

// Change Password Validation Schema
export const changePasswordValidationSchema = Joi.object({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});

// Reset Password Validation Schema
export const resetPasswordValidationSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

// Verify OTP Validation Schema
export const verifyOtpValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 1, tlds: { allow: ['com'] } })
    .required()
    .label('Email'),
  otp: Joi.string().required(),
});
