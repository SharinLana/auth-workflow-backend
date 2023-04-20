const { CustomAPIError } = require("../errors/index");
const { isTokenValid, attachCookiesToResponse } = require("../utils/jwt");
const Token = require("../models/Token");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next(); // passing to the controller
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomAPIError.UnauthenticatedError("Authentication invalid!");
    }

    attachCookiesToResponse({
      res,
      tokenPayload: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (err) {
    throw new CustomAPIError.UnauthenticatedError("Authentication invalid!");
  }
};

module.exports = authenticateUser;
