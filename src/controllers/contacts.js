const { createContact, updateContact } = require('../services/contact');
const createHttpError = require('http-errors');

const addContactController = async (req, res, next) => {
  try {
    const contactData = { ...req.body, userId: req.user._id };
    if (req.file) {
      contactData.photo = req.file.path;
    }
    const contact = await createContact(contactData);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContactController = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.photo = req.file.path;
    }
    const contact = await updateContact(
      req.params.id,
      updateData,
      req.user._id,
    );
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addContactController,
  updateContactController,
};
