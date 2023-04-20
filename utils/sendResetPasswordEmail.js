const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async ({
  name,
  email,
  passwordToken,
  origin,
}) => {
  const resetURL = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;

  const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendResetPasswordEmail;