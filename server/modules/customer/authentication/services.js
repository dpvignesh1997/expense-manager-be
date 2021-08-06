const { SCHEMA, ERRORS, CONSTANTS } = require("../../../config/constants");
const sequelize = require("../../../utils/sequelize");
const { sendMail } = require("../../../utils/mailer");
const { QueryTypes } = require("sequelize");
const { compareHash, generateHash } = require("../../../utils/bcrypt");
const { generateAccessToken } = require("../../../utils/crypto");
const { createToken } = require("../tokens/services");

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
    const [user] = await sequelize.query(
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
    if (!user)
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
     * the User
     */
    await sequelize.query(`
            UPDATE public."${SCHEMA.CUSTOMERS}" SET
                password_reset_token = '${resetToken}',
                password_reset_token_expires_at = (NOW() AT TIME ZONE 'UTC') + INTERVAL '2 HOUR'
            WHERE id = ${user.id}
        `);

    const resetPasswordUrl = `${CONSTANTS.FRONTEND_URL}/reset-password`;

    /**
     * Send Reset Password Email
     * to the User.
     */
    await sendMail({
      to: [email],
      html: `To Reset your password, please <a href="${resetPasswordUrl}?token=${resetToken}">Click here</a>`,
      subject: "Reset Password",
    });

    /**
     * Timeout Function to remove the Reset
     * Password details from User after 2 hours.
     */
    setTimeout(async () => {
      await sequelize.query(`
            UPDATE public."${SCHEMA.CUSTOMERS}" SET
                password_reset_token = NULL,
                password_reset_token_expires_at = NULL
            WHERE id = ${user.id}
        `);
    }, 7200000);

    /**
     * @returns {Boolean}
     */
    return true;
  } catch (error) {
    // Log the Error
    console.error("Error in User Forgot Password => ", error);

    // Throw the Error
    throw error;
  }
};

/**
 * Change Password for a User
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
    const [user] = await sequelize.query(
      `
            SELECT * FROM public."${SCHEMA.CUSTOMERS}"
            WHERE password_reset_token = '${resetToken}'
            AND password_reset_token_expires_at >= (NOW() AT TIME ZONE 'UTC')
        `,
      {
        type: QueryTypes.SELECT,
      }
    );
    if (!user)
      throw {
        statusCode: 400,
        message: "Reset Password period has been expired.",
      };

    // Hash the New Password
    const passwordHash = await generateHash(password);

    /**
     * Update the New Password for
     * the User.
     */
    await sequelize.query(
      `
            UPDATE public."${SCHEMA.CUSTOMERS}" SET
                password_reset_token = NULL,
                password_reset_token_expires_at = NULL,
                password = '${passwordHash}'
            WHERE id = ${user.id}
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
 * Create Signin Token for a User
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
     * Get the User with provided Username type
     * and Username.
     */
    const [user] = await sequelize.query(
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
    if (!user)
      throw {
        statusCode: 400,
        message: "User does not exist.",
      };

    /**
     * Check if the Password matches.
     * If it does NOT match then
     * send Bad Request Error.
     */
    if (!(await compareHash(password, user["password"])))
      throw {
        statusCode: 400,
        message: "Invalid Credentials.",
      };

    // Query to Get User Details
    const QUERY = `
            SELECT
                customer.id,
                customer.email,
                customer.full_name,
            FROM public."${SCHEMA.CUSTOMERS}" AS customer
            WHERE customer.${usernameType} = '${username}'
            LIMIT 1
        `;

    // Create New Session Token
    const [token] = await createToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    });

    // Get the User details
    const [userInfo] = await sequelize.query(QUERY, {
      type: QueryTypes.SELECT,
    });

    /**
     * @returns {Object}
     */
    return {
      userInfo,
      token,
    };
  } catch (error) {
    // Log the Error
    console.error("Error in Customer Signin => ", error);

    // Throw the Error
    throw error;
  }
};

module.exports = {
  serializeUser,
  signin,
  forgotPassword,
  changePassword,
};
