const { celebrate, SchemaOptions } = require("celebrate");

// Don't change this. It will break most of the APIs.
const validationOptions = {
  abortEarly: true, // abort after the first validation error
  allowUnknown: true, // allow unknown keys that will be ignored
  stripUnknown: { arrays: false, objects: true }, // remove unknown keys from objects but not arrays
};

/**
 * Celebrate Validator
 * @param {SchemaOptions} schema
 * @returns
 */
module.exports = (schema) => celebrate(schema, validationOptions);
