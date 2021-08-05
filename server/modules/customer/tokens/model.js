const { DataTypes } = require("sequelize");
const sequelize = require("../../../utils/sequelize");
const { SCHEMA } = require("../../../config/constants");
const MODEL_NAME = SCHEMA.CUSTOMER_TOKENS;

/**
 * Customer Token Model Definition
 */
module.exports = sequelize.define(
  SCHEMA.CUSTOMER_TOKENS,
  {
    // ID Primary Key Field
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // JWT Token
    token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    // Foreign Key reference for User (One to Many)
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SCHEMA.CUSTOMERS,
        key: "id",
      },
    },
    // Token Expiration
    expires_at: {
      type: "TIMESTAMP",
      // defaultValue: utc().add(30, 'days').toISOString(),
      allowNull: false,
    },
    // Logged Out Time
    logged_out: {
      type: "TIMESTAMP",
      allowNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("(NOW() AT TIME ZONE 'UTC')"),
      allowNull: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("(NOW() AT TIME ZONE 'UTC')"),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["user_id"],
      },
      {
        unique: true,
        fields: ["token"],
      },
    ],
  },
  {
    // Sequelize Instance
    sequelize,

    // Table Name
    tableName: SCHEMA.CUSTOMER_TOKENS,

    // Model Name
    modelName: MODEL_NAME,

    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
  }
);
