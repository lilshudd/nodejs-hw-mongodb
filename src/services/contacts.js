const { Contact } = require('../models/contact');

const getContacts = async ({ page, perPage, sortBy, sortOrder, filters }) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const query = { ...filters };
  return await Contact.find(query).skip(skip).limit(limit).sort(sort).exec();
};

const getContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

const createContact = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

const updateContact = async (id, updateData, userId) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, updateData, {
    new: true,
  });
};

const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
