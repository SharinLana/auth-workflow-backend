const { StatusCodes } = require("http-status-codes");

// Checking if the user exists to direct him to the restricted route
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user }); // more stuff can be added to the req.user object but don't include the password!
};

module.exports = {
  showCurrentUser,
};
