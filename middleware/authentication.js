const { CustomAPIError } = require("../errors/index");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
  } catch (err) {
    throw new CustomAPIError.UnauthenticatedError("Authentication invalid!");
  }
};

module.exports = authenticateUser;
