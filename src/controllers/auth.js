const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { Session } = require('../models/Session');
const { sendResetEmail } = require('../services/email');
const {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} = require('../services/auth');
const ctrlWrapper = require('../middlewares/ctrlWrapper');

const registerController = ctrlWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await registerUser({ name, email, password });

  if (!user) {
    throw createError(409, 'Email in use');
  }

  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

const loginController = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginUser({
    email,
    password,
  });

  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  res.cookie('refreshToken', refreshToken, { httpOnly: true });

  res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: { accessToken },
  });
});

const refreshController = ctrlWrapper(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'Refresh token is missing');
  }
  try {
    const { accessToken, newRefreshToken } = await refreshSession(refreshToken);
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

    res.status(200).json({
      status: 200,
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});

const logoutController = ctrlWrapper(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'Refresh token is missing');
  }
  await logoutUser(refreshToken);

  res.clearCookie('refreshToken');

  res.status(204).json({
    status: 204,
    message: 'Logout successful',
    data: null,
  });
});

const sendResetEmailController = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw createError(404, 'User not found!');
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    await sendResetEmail(email, token);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    if (error.response) {
      next(
        createError(500, 'Failed to send the email, please try again later.'),
      );
    } else {
      next(error);
    }
  }
};

const resetPasswordController = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

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
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      next(createError(401, 'Token is expired or invalid.'));
    } else {
      next(error);
    }
  }
};

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
};
