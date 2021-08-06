const { encrypt } = require("../../../utils/crypto");
const { QueryTypes } = require("sequelize");
const sequelize = require("../../../utils/sequelize");
const { ERRORS, SCHEMA } = require("../../../config/constants");
const Users = require("../users/users.model");

/**
 * Create Token
 * @param {Object} user
 * @returns {String}
 */
const createToken = async (user) => {
  try {
    // Token Cipher text
    const token = encrypt(
      JSON.stringify({
        user_id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
    );

    const [generatedToken] = await sequelize.query(
      `
            INSERT INTO public."${SCHEMA.CUSTOMER_TOKENS}" (
                token, user_id, expires_at
            )
            VALUES (
                '${token}',
                ${user.id},
                (NOW() AT TIME ZONE 'UTC') + INTERVAL '30 DAY'
            ) RETURNING token, expires_at, created_at;
        `,
      {
        type: QueryTypes.INSERT,
      }
    );

    return generatedToken;
  } catch (error) {
    // Log
    console.error("Error in Creating Customer Token => ", error);

    // Throw the error
    throw error;
  }
};

/**
 * Check if Token is Valid
 * @param {String} token
 * @returns {Object}
 */
const validateToken = async (token) => {
  try {
    const [exisitngToken] = await sequelize.query(
      `
            SELECT * 
            FROM public."${SCHEMA.ADMIN_TOKENS}" 
            WHERE token = '${token}' AND
            expires_at >= (NOW() AT TIME ZONE 'UTC')
            AND logged_out IS NULL
        `,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!exisitngToken) throw ERRORS.UNAUTHORIZED;

    const user = await Users.findOne({
      where: {
        id: exisitngToken["user_id"],
        org_id: exisitngToken["org_id"],
      },
    });
    if (!user) throw ERRORS.UNAUTHORIZED;

    return user;
  } catch (error) {
    // Log
    console.error("Error in validating Admin Token => ", error);

    // Throw the error
    throw error;
  }
};

module.exports = {
  createToken,
  validateToken,
};
