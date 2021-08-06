const router = require("express").Router();
const { Signin, ForgotPassword, ChangePassword } = require("./controllers");

// Signin Route
router.post("/signin", Signin);

// Forgot Password Route
router.post("/forgot-password", ForgotPassword);

// Change Password Route
router.post("/reset-password", ChangePassword);

// Export Express Router Manager
module.exports = router;
