const { AES, enc } = require("crypto-js");
const { CONSTANTS } = require("../config/constants");

/**
 * Encrypt Data
 * @param {any} data
 * @returns {String}
 */
const encrypt = (data) => {
  try {
    return AES.encrypt(data, CONSTANTS.SECRET).toString();
  } catch (error) {
    // Log
    console.error("Error in Encrypt");

    // Throw the Error
    throw error;
  }
};

/**
 * Decrypt Data
 * @param {String} ciphertext
 * @returns {any}
 */
const decrypt = (ciphertext) => {
  try {
    return AES.decrypt(ciphertext, CONSTANTS.SECRET).toString(enc.Utf8);
  } catch (error) {
    // Log
    console.error("Error in Encrypt");

    // Throw the Error
    throw error;
  }
};

module.exports = {
  encrypt,
  decrypt,
};
