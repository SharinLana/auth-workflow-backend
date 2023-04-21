const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const User = require("../models/User");
const Token = require("../models/Token");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const { attachCookiesToResponse } = require("../utils/jwt");
const createTokenPayload = require("../utils/tokenPayload");
const sendVerificationEmail = require("../utils/sendVerficationEmail");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const hashString = require("../utils/createHash");

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

  // const origin = "http://localhost:3000";
  const origin = "https://mern-auth-workflow.onrender.com";
  // const newOrigin = 'https://react-node-user-workflow-front-end.netlify.app';

  // const tempOrigin = req.get('origin');
  // const protocol = req.protocol;
  // const host = req.get('host');
  // const forwardedHost = req.get('x-forwarded-host');
  // const forwardedProtocol = req.get('x-forwarded-proto');

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

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

  let = refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    refreshToken = existingToken.refreshToken;

    attachCookiesToResponse({ res, tokenPayload, refreshToken });

    res.status(StatusCodes.OK).json({
      user: tokenPayload,
    });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, tokenPayload, refreshToken });

  res.status(StatusCodes.OK).json({
    user: tokenPayload,
  });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId }); // req.user.userId came from the authentication middleware I attached to the /logout route

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "user logged out" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(40).toString("hex");

    // const origin = "http://localhost:3000";
    const origin = "https://mern-auth-workflow.onrender.com";
    // send email
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      passwordToken: passwordToken,
      origin,
    });

    const tenMin = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMin);

    user.passwordToken = hashString(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  if (!token || !password || !email) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.send("reset password");
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
