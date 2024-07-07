const createError = require('http-errors');
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
    status: 'success',
    message: 'Successfully registered a user!',
    data: {
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
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
    status: 'success',
    message: 'Successfully logged in a user!',
    data: { accessToken },
  });
});

const refreshController = ctrlWrapper(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'Refresh token is missing');
  }
  const { accessToken, newRefreshToken } = await refreshSession(refreshToken);

  res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

  res.status(200).json({
    status: 'success',
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
});

const logoutController = ctrlWrapper(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw createError(401, 'Refresh token is missing');
  }
  await logoutUser(refreshToken);

  res.clearCookie('refreshToken');

  res.status(204).send();
});

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
};
