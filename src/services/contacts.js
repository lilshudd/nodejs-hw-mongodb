const createHttpError = require('http-errors');
const { Contact } = require('../models/contact');
const { uploadImage } = require('../config/cloudinary');

const getContacts = async (userId) => {
  return await Contact.find({ owner: userId });
};

const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, owner: userId });
};

const createContact = async (data, file) => {
  if (file) {
    const result = await uploadImage(file);
    data.photo = result.secure_url;
  }
  const contact = new Contact(data);
  return await contact.save();
};

const updateContact = async (contactId, data, userId, file) => {
  const contact = await Contact.findOne({ _id: contactId, owner: userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found.');
  }
  if (file) {
    const result = await uploadImage(file);
    data.photo = result.secure_url;
  }
  Object.assign(contact, data);
  return await contact.save();
};

const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    owner: userId,
  });
  return contact;
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
