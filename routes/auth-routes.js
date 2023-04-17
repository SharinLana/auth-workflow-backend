const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
} = require("../controllers/auth-controllers");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify-email").post(verifyEmail);

module.exports = router;
