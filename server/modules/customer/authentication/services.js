const { SCHEMA, ERRORS, CONSTANTS } = require("../../../config/constants");
const sequelize = require("../../../utils/sequelize");
const { sendMail } = require("../../../utils/mailer");
const { QueryTypes } = require("sequelize");
const { compareHash, generateHash } = require("../../../utils/bcrypt");
const { generateAccessToken } = require("../../../utils/crypto");
const { createToken } = require("../tokens/services");
const { createCustomer } = require("../../customer/customers/services");
const {
  checkIfCustomerAlreadyExists,
} = require("../../customer/customers/helpers");

/**
 * Serialize Customer
 * @param {Object} customer
 * @returns
 */
const serializeCustomer = async (customer) => {
  try {
    const existingCustomer = await checkIfCustomerAlreadyExists(customer.email);

    if (!existingCustomer) {
      const { name, email, picture } = customer;

      return await createCustomer({
        full_name: name,
        email,
        picture,
      });
    }

    return existingCustomer;
  } catch (error) {
    // Log
    console.error("Error while Serializing Customer => ", error);

    // Throw the Error
    throw error;
  }
};

/**
 * Reset Password for a user
 * @param {String} email
 * @returns {Boolean | Error}
 */
const forgotPassword = async (email) => {
  try {
    /**
     * Check if the User Exists with the provided
     * Email Address.
     * If does NOT exists send Bad Request Error.
     */
    const [customer] = await sequelize.query(
      `
            SELECT 
                customer.id,
                customer.org_id,
                customer.email,
                customer.full_name,
            FROM public."${SCHEMA.CUSTOMERS}" AS customer
            WHERE customer.email = '${email}'
            LIMIT 1
        `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!customer)
      throw {
        statusCode: 400,
        message: "User does not exist.",
      };

    /**
     * Generate a Reset Password Token
     * with a Expiration of 2 hours.
     */
    const resetToken = await generateAccessToken(
      JSON.stringify({
        email,
      })
    );

    /**
     * Update the Reset Password Token details for
     * the Customer
     */
    await sequelize.query(`
            UPDATE public."${SCHEMA.CUSTOMERS}" SET
                password_reset_token = '${resetToken}',
                password_reset_token_expires_at = (NOW() AT TIME ZONE 'UTC') + INTERVAL '2 HOUR'
            WHERE id = ${customer.id}
        `);

    const resetPasswordUrl = `${CONSTANTS.FRONTEND_URL}/reset-password`;

    /**
     * Send Reset Password Email
     * to the Customer.
     */
    await sendMail({
      to: [email],
      html: `To Reset your password, please <a href="${resetPasswordUrl}?token=${resetToken}">Click here</a>`,
      subject: "Reset Password",
    });

    /**
     * Timeout Function to remove the Reset
     * Password details from Customer after 2 hours.
     */
    setTimeout(async () => {
      await sequelize.query(`
            UPDATE public."${SCHEMA.CUSTOMERS}" SET
                password_reset_token = NULL,
                password_reset_token_expires_at = NULL
            WHERE id = ${customer.id}
        `);
    }, 7200000);

    /**
     * @returns {Boolean}
     */
    return true;
  } catch (error) {
    // Log the Error
    console.error("Error in Customer Forgot Password => ", error);

    // Throw the Error
    throw error;
  }
};

/**
 * Change Password for a Customer
 * @param {String} resetToken
 * @param {String} password
 * @returns {Boolean | Error}
 */
const changePassword = async (resetToken, password) => {
  try {
    /**
     * Check if the provided Reset Token is
     * valid.
     * If it is NOT valid send Bad Request Error.
     */
    const [customer] = await sequelize.query(
      `
            SELECT * FROM public."${SCHEMA.CUSTOMERS}"
            WHERE password_reset_token = '${resetToken}'
            AND password_reset_token_expires_at >= (NOW() AT TIME ZONE 'UTC')
        `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!customer)
      throw {
        statusCode: 400,
        message: "Reset Password period has been expired.",
      };

    // Hash the New Password
    const passwordHash = await generateHash(password);

    /**
     * Update the New Password for
     * the Customer.
     */
    await sequelize.query(
      `
            UPDATE public."${SCHEMA.CUSTOMERS}" SET
                password_reset_token = NULL,
                password_reset_token_expires_at = NULL,
                password = '${passwordHash}'
            WHERE id = ${customer.id}
        `,
      {
        type: QueryTypes.UPDATE,
      }
    );

    /**
     * @returns {Boolean}
     */
    return true;
  } catch (error) {
    // Log the Error
    console.error("Error in User Change Password => ", error);

    // Throw the Error
    throw error;
  }
};

/**
 * Create Signin Token for a Customer
 * @param {String} username
 * @param {Password} password
 * @returns {Object | Error}
 */
const signin = async (username, password) => {
  try {
    // Change the Username to Lowecase
    username = String(username).toLowerCase();

    /**
     * Check if the provided Username is type
     * Email or Username.
     */
    const usernameType = CONSTANTS.EMAIL_REGEXP.test(username)
      ? "email"
      : "username";

    /**
     * Get the Customer with provided Username type
     * and Username.
     */
    const [customer] = await sequelize.query(
      `
            SELECT
                customer.id,
                customer.full_name,
                customer.username,
                customer.email,
                customer.password,
                customer.profile_picture
            FROM public."${SCHEMA.CUSTOMERS}" AS customer
            WHERE ${usernameType} = '${username}'
            LIMIT 1
        `,
      {
        type: QueryTypes.SELECT,
      }
    );

    /**
     * If the User does NOT exist
     * then send Bad Request Error.
     */
    if (!customer)
      throw {
        statusCode: 400,
        message: "User does not exist.",
      };

    /**
     * Check if the Password matches.
     * If it does NOT match then
     * send Bad Request Error.
     */
    if (!(await compareHash(password, customer["password"])))
      throw {
        statusCode: 400,
        message: "Invalid Credentials.",
      };

    // Query to Get Customer Details
    const QUERY = `
            SELECT
                customer.id,
                customer.email,
                customer.full_name
            FROM public."${SCHEMA.CUSTOMERS}" AS customer
            WHERE customer.${usernameType} = '${username}'
            LIMIT 1
        `;

    // Create New Session Token
    const [token] = await createToken({
      id: customer.id,
      email: customer.email,
      full_name: customer.full_name,
    });

    // Get the Customer details
    const [customerInfo] = await sequelize.query(QUERY, {
      type: QueryTypes.SELECT,
    });

    /**
     * @returns {Object}
     */
    return {
      customerInfo,
      token,
    };
  } catch (error) {
    // Log the Error
    console.error("Error in Customer Signin => ", error);

    // Throw the Error
    throw error;
  }
};

/**
 * Create a New Customer
 * @param {Object} customer
 * @returns
 */
const signup = async (customer) => {
  try {
    /**
     * Check if the Customer already exists.
     * If YES, then throw USER_ALREADY_EXISTS error.
     */
    const existingCustomer = await checkIfCustomerAlreadyExists(customer.email);
    if (existingCustomer) throw ERRORS.USER_ALREADY_EXISTS;

    // Create New Customer
    const createdCustomer = await createCustomer(customer);
    return createdCustomer;
  } catch (error) {
    // Log the Error
    console.error("Error in Customer Signin => ", error);

    // Throw the Error
    throw error;
  }
};

module.exports = {
  serializeCustomer,
  signin,
  forgotPassword,
  changePassword,
  signup,
};
