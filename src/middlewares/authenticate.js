const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { User } = require('../db/User');
const { Session } = require('../db/Session');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createError(401, 'Authorization header is missing'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      return next(createError(401, 'Invalid or expired token'));
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(createError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch {
    next(createError(401, 'Invalid or expired token'));
  }
};

module.exports = authenticate;
