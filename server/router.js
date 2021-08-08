const CustomerRouter = require("./modules/customer/router");

/**
 * Core Routing
 * @param {Express} app
 */
module.exports = (app) => {
  try {
    // Customer Routes
    CustomerRouter(app);
  } catch (error) {
    console.error(error);
  }
};
