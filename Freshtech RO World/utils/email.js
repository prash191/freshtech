const NodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  // create transporter.
  const transporter = NodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define mail options.
  const mailOptions = {
    from: 'Prashant Sharma <psprashant191@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the email.
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
