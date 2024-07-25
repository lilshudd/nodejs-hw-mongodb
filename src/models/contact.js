const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  photo: { type: String, default: '' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Contact = model('Contact', contactSchema);

module.exports = { Contact };
