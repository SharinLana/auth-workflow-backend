const express = require("express");
const authenticateUser = require("../middleware/authentication");
const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth-controllers");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").delete(authenticateUser, logout);
router.route("/verify-email").post(verifyEmail);
router.route("/reset-password").post(resetPassword);
router.route("/forgot-password").post(forgotPassword);

module.exports = router;
