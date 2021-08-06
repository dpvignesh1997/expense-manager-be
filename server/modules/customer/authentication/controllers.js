const { ERRORS, CONSTANTS } = require("../../../config/constants");
const { OK } = require("http-status-codes");
const { signin, forgotPassword, changePassword } = require("./services");

/**
 * Customer Signin
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 * @returns {Response}
 */
const Signin = async (req, res, next) => {
  try {
    /**
     * Get Username/Email & Password
     * from Request Body.
     */
    const { username, password } = req.body;

    /**
     * Create Token for a New Session
     */
    const signinInfo = await signin(String(username).toLowerCase(), password);

    /**
     * Send Token Details as Response
     */
    return res.status(OK).json({
      statusCode: OK,
      message: "Signin Successful",
      ...signinInfo,
    });
  } catch (error) {
    // Log the Error
    console.error("Error occurred in Signin API => ", error);

    // Set Error Properties
    const err =
      error.statusCode && error.message ? error : ERRORS.INTERNAL_SERVER_ERROR;

    /**
     * @return {Response} Error
     */
    return res.status(err.statusCode).send({ message: err.message });
  }
};

/**
 * Forgot Password
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 * @returns {Response}
 */
const ForgotPassword = async (req, res, next) => {
  try {
    /**
     * Get Email Address from
     * Request Body.
     */
    const { email } = req.body;

    /**
     * Send Reset Password Password Email
     * to the Customer Email Address if exists.
     */
    await forgotPassword(String(email).toLowerCase());

    /**
     * @return {Response}
     */
    return res.status(OK).json({
      statusCode: OK,
      message: "Password Reset Mail has been sent.",
    });
  } catch (error) {
    // Log the Error
    console.error("Error occurred in Forgot Password API => ", error);

    // Set Error Properties
    const err =
      error.statusCode && error.message ? error : ERRORS.INTERNAL_SERVER_ERROR;

    /**
     * @return {Response} Error
     */
    return res.status(err.statusCode).send({ message: err.message });
  }
};

/**
 * Change Password
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 * @returns {Response}
 */
const ChangePassword = async (req, res, next) => {
  try {
    /**
     * Get Reset Token & New User Password from
     * Request Body.
     */
    const { resetToken, password } = req.body;

    /**
     * Reset the Password for the Customer
     */
    await changePassword(resetToken, password);

    /**
     * @return {Response}
     */
    return res.redirect(`${CONSTANTS.RESET_PASSWORD_URL}/login`);
  } catch (error) {
    // Log the Error
    console.error("Error occurred in Change Password API => ", error);

    // Set Error Properties
    const err =
      error.statusCode && error.message ? error : ERRORS.INTERNAL_SERVER_ERROR;

    /**
     * @return {Response} Error
     */
    res.status(err.statusCode).send({ message: err.message });
  }
};

module.exports = {
  Signin,
  ForgotPassword,
  ChangePassword,
};
