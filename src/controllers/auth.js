const createError = require('http-errors');
const {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sendResetEmail,
  resetPassword,
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
  } catch {
    next(createError(401, 'Invalid refresh token'));
  }
});

const logoutController = ctrlWrapper(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'Refresh token is missing');
  }
  await logoutUser(refreshToken);
  res.clearCookie('refreshToken');

  res.status(200).json({
    status: 200,
    message: 'Logout successful',
    data: {},
  });
});

const sendResetEmailController = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  await sendResetEmail(email);
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
});

const resetPasswordController = ctrlWrapper(async (req, res) => {
  const { token, password } = req.body;
  await resetPassword(token, password);
  res.status(200).json({
    status: 200,
    message: 'Password has been reset successfully.',
    data: {},
  });
});

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
};
