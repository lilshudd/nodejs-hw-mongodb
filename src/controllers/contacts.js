const createError = require('http-errors');
const { Contact } = require('../db/contact');

const getContacts = async (req, res) => {
  const contacts = await Contact.find({ userId: req.user._id });
  res.json(contacts);
};

const getContactById = async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.json(contact);
};

const addContact = async (req, res) => {
  const contact = new Contact({ ...req.body, userId: req.user._id });
  await contact.save();
  res.status(201).json(contact);
};

const updateContact = async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: req.body },
    { new: true },
  );
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.json(contact);
};

const deleteContact = async (req, res) => {
  const contact = await Contact.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
};
