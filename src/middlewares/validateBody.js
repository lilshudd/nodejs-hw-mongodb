const createError = require('http-errors');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(createError(400, error.message));
    } else {
      next();
    }
  };
};

module.exports = validateBody;
