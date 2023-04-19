const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, tokenPayload, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { tokenPayload } });
  const refreshTokenJWT = createJWT({
    payload: { tokenPayload, refreshToken },
  });

  const tenMin = 1000 * 60 * 10;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + tenMin),
    secure: process.env.NODE_ENV === "production", // to secure the cookies from modifying in the browser
    signed: true,
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneMonth),
    secure: process.env.NODE_ENV === "production", // to secure the cookies from modifying in the browser
    signed: true,
  });
};

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };
