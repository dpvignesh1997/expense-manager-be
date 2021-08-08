const router = require("express").Router();
const passport = require("passport");
const { CONSTANTS } = require("../../../config/constants");
const { GetCurrentCustomer, UpdateCurrentCustomer } = require("./controllers");

// Get Customer Profile
router.get(
  "/my-profile",
  passport.authenticate("customer", CONSTANTS.SESSION),
  GetCurrentCustomer
);

// Update Current Customer Profile
router.put(
  "/",
  passport.authenticate("customer", CONSTANTS.SESSION),
  UpdateCurrentCustomer
);

module.exports = router;
