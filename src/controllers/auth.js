const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { Session } = require('../models/Session');
const createError = require('http-errors');

const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
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

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(
      createError(
        500,
        `Failed to send the email, please try again later. Error: ${error.message}`,
      ),
    );
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(
      createError(401, `Token is expired or invalid. Error: ${error.message}`),
    );
  }
};

module.exports = {
  sendResetEmailController,
  resetPasswordController,
};
