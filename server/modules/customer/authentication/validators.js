const Joi = require("joi");

/**
 * User Signin Validator using Email Address
 */
const signin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

/**
 * User Signup Validator using Username
 */
const signup = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
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
  signin,
  signup,
};
