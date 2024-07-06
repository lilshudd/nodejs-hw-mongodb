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
  const { user, accessToken } = await loginUser({ email, password });

  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  res.status(200).json({
    status: 'success',
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
});

const refreshController = ctrlWrapper(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { accessToken } = await refreshSession(refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
});

const logoutController = ctrlWrapper(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await logoutUser(refreshToken);

  res.status(204).send();
});

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
};
