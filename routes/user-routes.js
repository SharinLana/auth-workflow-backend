const express = require("express");
const authenticateUser = require("../middleware/authentication");
const {
  showCurrentUser,
} = require("../controllers/user-controllers");

const router = express.Router();

router.route("/showMe").get(authenticateUser, showCurrentUser);

module.exports = router;
