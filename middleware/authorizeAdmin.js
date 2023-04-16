const { PermissionDeniedError } = require("../errors/index");

const authorizeAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new PermissionDeniedError(
        "You don't have permissions to access this route!"
      );
    }
    next();
  };
};

module.exports = authorizeAdmin;
