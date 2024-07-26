const {
  createContact,
  updateContact,
  getContacts,
  getContactById,
  deleteContact,
} = require('../services/contacts');
const createHttpError = require('http-errors');

const addContactController = async (req, res, next) => {
  try {
    const contactData = { ...req.body, userId: req.user._id };
    if (req.file) {
      contactData.photo = req.file.path;
    }
    const contact = await createContact(contactData, req.file);
    res
      .status(201)
      .json({ status: 201, message: 'Contact created', data: contact });
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
      req.file,
    );
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({ status: 200, message: 'Contact updated', data: contact });
  } catch (error) {
    next(error);
  }
};

const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getContacts(req.user._id);
    res.json({ status: 200, message: 'Contacts fetched', data: contacts });
  } catch (error) {
    next(error);
  }
};

const getContactByIdController = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id, req.user._id);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({ status: 200, message: 'Contact fetched', data: contact });
  } catch (error) {
    next(error);
  }
};

const deleteContactController = async (req, res, next) => {
  try {
    const contact = await deleteContact(req.params.id, req.user._id);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({ status: 200, message: 'Contact deleted', data: contact });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addContactController,
  updateContactController,
  getContactsController,
  getContactByIdController,
  deleteContactController,
};
