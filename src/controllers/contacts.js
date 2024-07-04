const mongoose = require('mongoose');
const createError = require('http-errors');
const ctrlWrapper = require('../middlewares/ctrlWrapper');
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require('../services/contacts');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getContactsController = ctrlWrapper(async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;
  const filters = {};

  if (type) filters.contactType = type;
  if (typeof isFavourite !== 'undefined') filters.isFavourite = isFavourite;

  const contactsData = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
});

const getContactByIdController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  if (!isValidId(contactId)) {
    throw createError(400, 'Invalid contact ID');
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

const createContactController = ctrlWrapper(async (req, res) => {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

const updateContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  if (!isValidId(contactId)) {
    throw createError(400, 'Invalid contact ID');
  }

  const updatedContact = await updateContact(contactId, req.body);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: updatedContact,
  });
});

const deleteContactController = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;

  if (!isValidId(contactId)) {
    throw createError(400, 'Invalid contact ID');
  }

  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
});

module.exports = {
  getContacts: getContactsController,
  getContactById: getContactByIdController,
  createContact: createContactController,
  updateContact: updateContactController,
  deleteContact: deleteContactController,
};
