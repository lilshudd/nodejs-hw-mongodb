const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require('../services/contacts');
const createHttpError = require('http-errors');

const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getContacts({ userId: req.user._id });
    res.json({
      status: 'success',
      message: 'Contacts retrieved successfully',
      data: { contacts },
    });
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
    res.json({
      status: 'success',
      message: 'Contact retrieved successfully',
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

const addContactController = async (req, res, next) => {
  try {
    const contact = await createContact({ ...req.body, userId: req.user._id });
    res.status(201).json({
      status: 'success',
      message: 'Contact added successfully',
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

const updateContactController = async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.id, req.body, req.user._id);
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.json({
      status: 'success',
      message: 'Contact updated successfully',
      data: { contact },
    });
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
    res.status(204).json({
      status: 'success',
      message: 'Contact deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
};
