const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  // /user/verify-email is a front-end route
  const verifyEmailUrl = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmailUrl}">Verify Email</a></p>`;

  //   again, no await because we invoke this function inside of the register controller
  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
