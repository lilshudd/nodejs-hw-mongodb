const createError = require('http-errors');
const { Contact } = require('../db/contact');

const getContacts = async (req, res) => {
  const contacts = await Contact.find({ userId: req.user._id });
  res.json({
    status: 'success',
    message: 'Contacts retrieved successfully',
    data: { contacts },
  });
};

const getContactById = async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.json({
    status: 'success',
    message: 'Contact retrieved successfully',
    data: { contact },
  });
};

const addContact = async (req, res) => {
  const contact = new Contact({ ...req.body, userId: req.user._id });
  await contact.save();
  res.status(201).json({
    status: 'success',
    message: 'Contact added successfully',
    data: { contact },
  });
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    req.body,
    { new: true },
  );
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.json({
    status: 'success',
    message: 'Contact updated successfully',
    data: { contact },
  });
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOneAndDelete({
    _id: id,
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
