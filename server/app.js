const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const loggerIns = require("morgan");
const { CONSTANTS } = require("./config/constansts");
const sequelize = require("./utils/sequelize");
const passport = require("./utils/passport");
const app = express();

/**
 * Functionality used to start the express server
 * @returns {express} server instance
 */
const startExpressServer = async () => {
  // This is Workers can share any TCP connection
  // It will be initialized using express
  console.info(`Worker ${process.pid} started`);

  app.use(loggerIns("dev")); // For dev

  app.use(bodyParser.json({ limit: CONSTANTS.BODY_PARSER_LIMIT }));
  app.use(
    bodyParser.urlencoded({
      limit: CONSTANTS.BODY_PARSER_LIMIT,
      extended: true,
      parameterLimit: CONSTANTS.BODY_PARSER_PARAMETER_LIMIT,
    })
  );

  /**
   * Initialize Passport and restore authentication state, if any, from the
   * session.
   */
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(errors());

  // enable options response
  app.use(cors());

  // Helmet Configuration
  require("./utils/helmet")(app);

  // Enable Routes
  require("./router")(app);

  // Server Listening
  app.listen(process.env.PORT || 9091, async (err) => {
    if (err) {
      console.error(err);
      throw new Error(`Error while starting the server ${err}`);
    }

    console.info(
      `🛡️  ${CONSTANTS.APP.LISTEN}${CONSTANTS.PORT} AND THE WORKER ID IS ${process.pid}  🛡️`
    );

    // Sequelize Connection
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      // await sequelize.sync({ alter: true });
      console.log("All models were synchronized successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });
};

startExpressServer();

module.exports = app;
