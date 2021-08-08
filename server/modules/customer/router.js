const Authentication = require("./authentication/routes");

/**
 * Customer Routing
 * @param {Express} app
 */
module.exports = (app) => {
  try {
    // Authentication Routes
    app.use("/auth", Authentication);
  } catch (error) {
    console.error(error);
  }
};
