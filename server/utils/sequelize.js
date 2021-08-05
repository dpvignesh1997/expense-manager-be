const { Sequelize } = require("sequelize");

const HOST = process.env.PG_HOST;
const PORT = process.env.PG_PORT;
const DATABASE = process.env.PG_DATABASE;
const USER = process.env.PG_USER;
const PASSWORD = process.env.PG_PASSWORD;

// Sequelize Client
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;
