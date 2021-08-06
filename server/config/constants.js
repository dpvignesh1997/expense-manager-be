const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("http-status-codes");

/**
 * Neutral Constants
 */
const CONSTANTS = {
  LOCAL_HOST: process.env.LOCAL_HOST,

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL,

  PORT: process.env.PORT || 9090,
  APP: {
    LISTEN: "MAIN SERVICE IS LISTENING TO THE PORT: ",
  },
  API: {
    PREFIX: "/",
  },
  BODY_PARSER_LIMIT: "50mb",
  BODY_PARSER_PARAMETER_LIMIT: 5000,
  EXIT: "exit",
  DATE_FORMAT: "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]",
  ENV: {
    DEVELOPMENT: "development",
    LOCAL: "local",
    PRODUCTION: "production",
  },
  SECRET: process.env.SECRET_KEY,
  SESSION: { session: false },
  EMAIL_REGEXP:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

/**
 * Error Messages Constants
 */
const ERRORS = {
  BAD_REQUEST: {
    statusCode: BAD_REQUEST,
    message: "Bad Request",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: INTERNAL_SERVER_ERROR,
    message: "Internal Server Error",
  },
  UNAUTHORIZED: {
    statusCode: UNAUTHORIZED,
    message: "Unauthorized",
  },
  USER_DOESNT_EXIST: {
    statusCode: NOT_FOUND,
    message: "User does not exist",
  },
  INVALID_CREDENTIALS: {
    statusCode: BAD_REQUEST,
    message: "Invalid Credentials.",
  },
  USER_ALREADY_EXISTS: {
    statusCode: BAD_REQUEST,
    message: "User Already Exists",
  },
};

/**
 * Schema Constants
 */
const SCHEMA = {
  // Customers
  CUSTOMERS: "customers",
  CUSTOMER_TOKENS: "customer_tokens",
  EXPENSES: "expenses",

  // Admin
};

module.exports = {
  CONSTANTS,
  ERRORS,
  SCHEMA,
};
