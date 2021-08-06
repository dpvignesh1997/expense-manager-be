const Customers = require("./model");

/**
 * Check If Email Address already taken or not.
 * @param {String} email
 * @returns {Oject}
 */
const checkIfCustomerAlreadyExists = async (email) => {
  try {
    return Customers.findOne({
      where: {
        email,
      },
    });
  } catch (error) {
    // Log The Error
    console.error("Error in Checking If Customer Already Exists =>  ", error);

    // Throw The Error
    throw error;
  }
};

/**
 * Generate a Unique Username
 * @param {String} email
 * @param {Number} attempt
 * @returns {String} username
 */
const generateUsernameFromEmail = async (email, attempt = 1) => {
  try {
    /**
     * Generate Random Number with
     * number of Digits equal to Attempt paramter.
     */
    const randomNumber = Math.floor(Math.random() * 90 + Math.pow(10, attempt));

    /**
     * Append the generated Random number with the
     * name sliced from Email Address.
     * eg. johndoe31
     */
    const username = `${email}${attempt > 0 ? randomNumber : ""}`.toLowerCase();

    /**
     * Check if the a Customer already exist with the
     * generated Username.
     * If YES then return the function again to
     * generate a new username.
     * Repeat until a Unique Username is generated.
     */
    const existingCustomer = await Customers.findOne({
      where: {
        username,
      },
    });
    if (existingCustomer) return generateUsernameFromEmail(email, ++attempt);

    // Return Username
    return username;
  } catch (error) {
    // Log the Error
    console.error(
      "Error while generating Username from Email Address => ",
      error
    );

    // Throw the Error
    throw error;
  }
};

module.exports = {
  checkIfCustomerAlreadyExists,
  generateUsernameFromEmail,
};
