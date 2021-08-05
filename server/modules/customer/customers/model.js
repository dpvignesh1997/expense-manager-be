const { DataTypes } = require("sequelize");
const sequelize = require("../../../utils/sequelize");
const { SCHEMA } = require("../../../config/constants");
const MODEL_NAME = SCHEMA.CUSTOMERS;

/**
 * Customers Model Definition
 */
module.exports = sequelize.define(
  SCHEMA.CUSTOMERS,
  {
    // ID Primary Key Field
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // Full Name
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Unique Username
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    // Email ID
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please enter a valid email",
        },
      },
    },
    // Access Password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Profile Picture
    profile_picture: {
      type: DataTypes.STRING,
      defaultValue: "https://www.gravatar.com/avatar",
      allowNull: true,
    },
    // Created At
    created_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("(NOW() AT TIME ZONE 'UTC')"),
      allowNull: false,
    },
    // Updated At
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("(NOW() AT TIME ZONE 'UTC')"),
      allowNull: false,
    },

    /**
     * Password reset fields
     */
    // Password reset token
    password_reset_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Password reset token expiration timestamp
    password_reset_token_expires_at: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["email"],
      },
    ],
  },
  {
    // Sequelize Instance
    sequelize,

    // Table name
    tableName: SCHEMA.CUSTOMERS,

    // Model Name
    modelName: MODEL_NAME,

    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
  }
);
