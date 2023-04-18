const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const message = `<p>Please confirm your email by clicking on the following link: <a href="/user/verify-email">Verify Email</a></p>`;

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
