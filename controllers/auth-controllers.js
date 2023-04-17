const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const { attachCookiesToResponse } = require("../utils/jwt");
const createTokenPayload = require("../utils/tokenPayload");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide the name, email and password!");
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError(
      "This email is already in use. Please choose another one"
    );
  }
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    email,
    name,
    password,
    role,
    verificationToken,
  }); // to secure the role (by preventing the user to register as admin)

  await sendEmail();

  // send verification token back only while testing in Postman!
  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
    
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Authentication failed");
  }

  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Authentication failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "Email verified!",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide the email and password!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("No user found with this email");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Incorrect password!");
  }

  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your email");
  }

  const tokenPayload = createTokenPayload(user);
  attachCookiesToResponse({ res, tokenPayload });

  res.status(StatusCodes.OK).json({
    user: tokenPayload,
  });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "user logged out" });
};

module.exports = { register, login, logout, verifyEmail };
