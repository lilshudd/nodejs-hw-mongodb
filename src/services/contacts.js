const { Contact } = require('../db/contact');

const getContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'createdAt',
  sortOrder = 'asc',
  filters = {},
}) => {
  filters.userId = userId;
  const totalItems = await Contact.countDocuments(filters);
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;
  const contacts = await Contact.find(filters)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip((page - 1) * perPage)
    .limit(Number(perPage));
  return {
    contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

const createContact = async (contactData) => {
  const newContact = new Contact(contactData);
  const savedContact = await newContact.save();
  return savedContact.toObject({ versionKey: false });
};

const updateContact = async (contactId, updateData, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true },
  );
};

const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
