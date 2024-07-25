const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { User } = require('../db/user');
const { JWT_SECRET } = process.env;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset',
    text: `To reset your password, please click the following link: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};

module.exports = { sendResetEmail };
