const Joi = require("joi");

/**
 * User Signin Validator using Email Address
 */
const emailSignin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * User Signin Validator using Username
 */
const usernameSignin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

/**
 * Forgot Password Validator
 */
const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * Change Password Validator
 */
const changePassword = Joi.object({
  resetToken: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  forgotPassword,
  changePassword,
  emailSignin,
  usernameSignin,
};
