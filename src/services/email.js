const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset',
    text: `To reset your password, please click the following link: ${resetUrl}`,
    html: `<p>To reset your password, please click the following link: <a href="${resetUrl}">Reset Password</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
