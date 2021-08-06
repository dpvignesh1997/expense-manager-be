const { OK } = require("http-status-codes");
const { ERRORS } = require("../../../config/constants");
const { updateCustomer, getCustomerByID } = require("./services");

const GetCurrentCustomer = async (req, res, next) => {
  try {
    // Authenticated Customer
    const customer = req.user;

    const _customer = await getCustomerByID(customer.id);

    res.status(OK).json({
      statusCode: OK,
      data: _customer,
    });
  } catch (error) {
    // Log the Error
    console.error("Error occurred in Get Current Customer API => ", error);

    // Set Error Properties
    const err =
      error.statusCode && error.message ? error : ERRORS.INTERNAL_SERVER_ERROR;

    /**
     * @return {Response} Error
     */
    res.status(err.statusCode).send({ message: err.message });
  }
};

const UpdateCurrentCustomer = async (req, res, next) => {
  try {
    // Authenticated Customer
    const customer = req.user;

    const { full_name } = req.body;

    // Update Customer Properties
    let updateProperties = {};

    if (req.body.hasOwnProperty("full_name"))
      updateProperties["full_name"] = full_name;

    // Update Customer
    await updateCustomer(customer.id, updateProperties);

    res.status(OK).json({
      statusCode: OK,
      message: "Customer Profile updated successfully.",
    });
  } catch (error) {
    // Log the Error
    console.error("Error occurred in Update Current Customer API => ", error);

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
  GetCurrentCustomer,
  UpdateCurrentCustomer,
};
