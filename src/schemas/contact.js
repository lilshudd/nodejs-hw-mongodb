const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});

module.exports = { contactSchema };
