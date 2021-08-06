const Joi = require("joi");

/**
 * Create Customer Schema Validator
 */
const createCustomer = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateCustomer = Joi.object({
  full_name: Joi.string(),
});

module.exports = {
  createCustomer,
  updateCustomer,
};
