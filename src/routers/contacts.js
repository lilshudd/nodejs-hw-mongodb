const express = require('express');
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contacts');
const validateBody = require('../middlewares/validateBody');
const { contactSchema, updateContactSchema } = require('../schemas/contact');

const router = express.Router();

router.get('/', getContacts);
router.get('/:contactId', getContactById);
router.post('/', validateBody(contactSchema), createContact);
router.patch('/:contactId', validateBody(updateContactSchema), updateContact);
router.delete('/:contactId', deleteContact);

module.exports = router;
