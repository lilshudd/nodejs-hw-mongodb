const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { Session } = require('../models/Session');
const createError = require('http-errors');
const nodemailer = require('nodemailer');

const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

const resetPassword = async (token, password) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { email } = decoded;

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  await Session.deleteMany({ userId: user._id });
};

module.exports = {
  sendResetEmail,
  resetPassword,
};
