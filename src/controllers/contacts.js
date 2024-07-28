const createError = require('http-errors');
const Contact = require('../models/contact');
const { uploadImage } = require('../services/cloudinary');
const ctrlWrapper = require('../middlewares/ctrlWrapper');

const getContactsController = ctrlWrapper(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: 200,
    data: contacts,
  });
});

const getContactByIdController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    data: contact,
  });
});

const createContactController = ctrlWrapper(async (req, res) => {
  const { name, email, phoneNumber, isFavourite, contactType } = req.body;
  const photo = req.file ? await uploadImage(req.file.buffer) : '';

  const contact = new Contact({
    name,
    email,
    phoneNumber,
    isFavourite,
    contactType,
    photo,
  });
  await contact.save();
  res.status(201).json({
    status: 201,
    data: contact,
  });
});

const updateContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, isFavourite, contactType } = req.body;
  const photo = req.file ? await uploadImage(req.file.buffer) : '';

  const contact = await Contact.findByIdAndUpdate(
    id,
    { name, email, phoneNumber, isFavourite, contactType, photo },
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
  const contact = await Contact.findByIdAndDelete(id);
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
