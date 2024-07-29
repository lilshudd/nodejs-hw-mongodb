const createError = require('http-errors');
const mongoose = require('mongoose');
const Contact = require('../models/contact');
const { uploadImage } = require('../services/cloudinary');
const ctrlWrapper = require('../middlewares/ctrlWrapper');

const getContactsController = ctrlWrapper(async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
  } = req.query;
  const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
  const contacts = await Contact.find({ userId: req.user._id, ...filters })
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage))
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

  res.status(200).json({
    status: 200,
    message: 'Contacts fetched successfully',
    data: contacts,
  });
});

const getContactByIdController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'Invalid contact ID');
  }
  const contact = await Contact.findOne({ _id: id, userId: req.user._id });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Contact fetched successfully',
    data: contact,
  });
});

const createContactController = ctrlWrapper(async (req, res) => {
  const { name, email, phoneNumber, isFavourite, contactType } = req.body;
  const photo = req.file ? await uploadImage(req.file.buffer) : '';

  const contact = new Contact({
    userId: req.user._id,
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
    message: 'Contact created successfully',
    data: contact,
  });
});

const updateContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, isFavourite, contactType } = req.body;
  const photo = req.file ? await uploadImage(req.file.buffer) : '';

  const contact = await Contact.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { name, email, phoneNumber, isFavourite, contactType, photo },
    { new: true },
  );
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Contact updated successfully',
    data: contact,
  });
});

const deleteContactController = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Contact deleted successfully',
    data: {},
  });
});

module.exports = {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
};
