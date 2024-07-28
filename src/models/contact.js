const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    photo: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false },
);

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
