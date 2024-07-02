const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Something went wrong';
  const data = err.data || '';

  res.status(statusCode).json({ error: { status: statusCode, message, data } });
  next(err);
};

module.exports = { errorHandler };
