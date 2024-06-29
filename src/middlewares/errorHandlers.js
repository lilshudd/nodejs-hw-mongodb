const errorHandler = (err, req, res) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message || 'Something went wrong',
  });
};

module.exports = { errorHandler };
