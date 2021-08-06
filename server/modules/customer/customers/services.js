const { SCHEMA, ERRORS } = require("../../../config/constants");
const sequelize = require("../../../utils/sequelize");
const { QueryTypes } = require("sequelize");
const { generateUsernameFromEmail } = require("./helpers");
const Customers = require("./model");
const randomize = require("randomatic");
const { generateHash } = require("../../../utils/bcrypt");
const { utc } = require("moment");

/**
 * Service Function to Create a new Customer
 * @param {Object} customer
 */
const createCustomer = async (customer) => {
  try {
    // Generate unique Username
    customer["username"] = await generateUsernameFromEmail(
      customer["email"].match(/^([^@]*)@/)[1],
      0
    );

    // Set the Provided Password (or) Generate a Random Password for Customer
    const customerPassword = customer["password"] || randomize("aA0!", 8);

    // Hash the Password for DB
    const password = await generateHash(customerPassword);

    // Create new Customer
    await Customers.create(
      {
        ...customer,
        ...{
          password,
        },
      },
      {
        isNewRecord: true,
      }
    );

    return true;
  } catch (error) {
    // Log The Error
    console.error("Error in Creating Customer =>  ", error);

    // Throw The Error
    throw ERRORS.BAD_REQUEST;
  }
};

/**
 * Service Function to Update a Customer
 * @param {Number} customerId
 * @param {Object} customer
 */
const updateCustomer = async (customerId, customer) => {
  try {
    /**
     * Update the Customer
     * @returns {Object} updateResult
     */
    return await Customers.update(
      {
        ...customer,
        // Set update_at Property
        updated_at: utc().toISOString(),
      },
      {
        where: {
          id: customerId,
        },
      }
    );
  } catch (error) {
    // Log The Error
    console.error("Error in Updating Customer =>  ", error);

    // Throw The Error
    throw error;
  }
};

/**
 * Service Function to Delete a Customer
 * @param {Number} customerId
 */
const deleteCustomer = async (customerId) => {
  try {
    /**
     * Hard Delete the Customer
     * @returns {Object} updateResult
     */
    return await Customers.destroy({
      where: {
        id: customerId,
      },
    });
  } catch (error) {
    // Log The Error
    console.error("Error in Deleting Customer =>  ", error);

    // Throw The Error
    throw error;
  }
};

/**
 * Get Customer by ID
 * @param {Number | String} customerId
 * @returns
 */
const getCustomerByID = async (customerId) => {
  try {
    const QUERY = `
            SELECT
                customer.id,
                customer.full_name,
                customer.username,
                customer.email,
                customer.profile_picture,
                customer.created_at
            FROM public."${SCHEMA.CUSTOMERS}" AS customer
            WHERE customer.id = ${customerId}
            LIMIT 1
        `;

    const [customer] = await sequelize.query(QUERY, {
      type: QueryTypes.SELECT,
    });

    return customer ? customer : null;
  } catch (error) {
    // Log The Error
    console.error("Error in Getting Customer By ID => ", error);

    // Throw The Error
    throw error;
  }
};

module.exports = {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByID,
};
