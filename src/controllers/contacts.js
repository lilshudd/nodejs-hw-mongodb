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
    const contacts = await getContacts(req.user._id);
    res.status(200).json({
      status: 200,
      message: 'Contacts retrieved successfully.',
      data: { contacts },
    });
  } catch (error) {
    next(error);
  }
};

const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId, req.user._id);
    if (!contact) {
      throw createHttpError(404, 'Contact not found.');
    }
    res.status(200).json({
      status: 200,
      message: 'Contact retrieved successfully.',
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

const createContactController = async (req, res, next) => {
  try {
    const contact = await createContact(req.body, req.file);
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully.',
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  try {
    const updatedContact = await updateContact(
      contactId,
      req.body,
      userId,
      req.file,
    );
    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully.',
      data: { contact: updatedContact },
    });
  } catch (error) {
    next(error);
  }
};

const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  try {
    const contact = await deleteContact(contactId, userId);
    if (!contact) {
      throw createHttpError(404, 'Contact not found.');
    }
    res.status(200).json({
      status: 200,
      message: 'Contact deleted successfully.',
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
};
