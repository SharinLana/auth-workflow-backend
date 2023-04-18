const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Lana Sharin" <lana@example.com>', // sender address
    to: "user@example.com, new_user@example.com", // list of receivers
    subject: "Testing email ✔", // Subject line
    text: "Hello world", // plain text body
    html: "<b>Testing email</b>", // html body
  });
};

module.exports = sendEmail;
