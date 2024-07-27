const createError = require('http-errors');
const { Contact } = require('../db/contact');
const ctrlWrapper = require('../middlewares/ctrlWrapper');

const getContactsController = ctrlWrapper(async (req, res) => {
  const contacts = await Contact.find({ owner: req.user._id });
  res.status(200).json({
    status: 200,
    data: contacts,
  });
});

const getContactByIdController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOne({ _id: id, owner: req.user._id });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    data: contact,
  });
});

const createContactController = ctrlWrapper(async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = new Contact({ name, email, phone, owner: req.user._id });
  await contact.save();
  res.status(201).json({
    status: 201,
    data: contact,
  });
});

const updateContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const contact = await Contact.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { name, email, phone },
    { new: true },
  );
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    data: contact,
  });
});

const deleteContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Contact deleted successfully',
  });
});

module.exports = {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
};
