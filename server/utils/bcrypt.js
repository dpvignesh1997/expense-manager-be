const bcrypt = require("bcryptjs");
const SALT_ROUNDS = bcrypt.genSaltSync(+process.env.SALT_ROUNDS);

/**
 * Generate Password Hash
 * @param {String} password
 * @returns
 */
const generateHash = async (password) => {
  try {
    return bcrypt.hashSync(password, SALT_ROUNDS);
  } catch (error) {
    // Log the Error
    console.error("Error in Generating Password Hash => ", error);

    // Throw the Error
    throw error;
  }
};

/**
 * Compare Password Hash
 * @param {String} password
 * @param {String} hash
 * @returns
 */
const compareHash = async (password, hash) => {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    // Log the Error
    console.error("Error in Comparing Password Hash => ", error);

    // Throw the Error
    throw error;
  }
};

module.exports = {
  generateHash,
  compareHash,
};
