const { Contact } = require('../db/contact');
const createError = require('http-errors');
const ctrlWrapper = require('../middlewares/ctrlWrapper');

const getContacts = ctrlWrapper(async (req, res) => {
  const contacts = await Contact.find();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

const getContactById = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

const createContact = ctrlWrapper(async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const newContact = new Contact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });
  await newContact.save();

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

const updateContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: updatedContact,
  });
});

const deleteContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await Contact.findByIdAndDelete(contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
});

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
