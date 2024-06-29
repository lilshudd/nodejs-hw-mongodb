const express = require('express');
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contacts');

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', getContactById);
router.post('/', createContact);
router.patch('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

module.exports = router;
