const { CustomAPIError } = require("../errors/index");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomAPIError.UnauthenticatedError("Authentication invalid!");
  }

  try {
    const payload = isTokenValid({ token });
    // console.log(payload);
    req.user = { name: payload.name, userId: payload.userId, role: payload.role };
    next();
  } catch (err) {
    throw new CustomAPIError.UnauthenticatedError("Authentication invalid!");
  }
};

module.exports = authenticateUser;
