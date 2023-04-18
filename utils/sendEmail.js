const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  // send mail with defined transport object 
  // (no need to use "await" here because we use this function 
  // inside of the sendVerificationEmail function
  // which is being invoked inside of the register controller with the "await" keyword)
  return transporter.sendMail({
    from: '"Lana Sharin" <lana@example.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
};

module.exports = sendEmail;
