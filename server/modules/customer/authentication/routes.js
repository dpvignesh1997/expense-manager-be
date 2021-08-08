const router = require("express").Router();
const passport = require("passport");
const {
  Signup,
  Signin,
  ForgotPassword,
  ChangePassword,
} = require("./controllers");
const celebrateValidator = require("../../../utils/celebrate-validator");
const validators = require("./validators");

// // Google Signin
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Google Authentication Callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/auth/google" }),
//   GoogleCallback
// );

// Signup Route
router.post(
  "/signup",
  celebrateValidator({
    body: validators.signup,
  }),
  Signup
);

// Signin Route
router.post(
  "/signin",
  celebrateValidator({
    body: validators.signin,
  }),
  Signin
);

// Forgot Password Route
router.post(
  "/forgot-password",
  celebrateValidator({
    body: validators.forgotPassword,
  }),
  ForgotPassword
);

// Change Password Route
router.post(
  "/reset-password",
  celebrateValidator({
    body: validators.changePassword,
  }),
  ChangePassword
);

// Export Express Router Manager
module.exports = router;
