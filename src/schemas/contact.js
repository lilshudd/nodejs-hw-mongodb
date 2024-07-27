const Joi = require('joi');

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(10).max(15),
}).or('name', 'email', 'phone');

module.exports = {
  createContactSchema,
  updateContactSchema,
};
