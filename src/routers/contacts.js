const express = require('express');
const {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} = require('../controllers/contacts');
const validateBody = require('../middlewares/validateBody');
const { contactSchema } = require('../schemas/contact');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', authenticate, getContacts);
router.get('/:id', authenticate, getContactById);
router.post('/', authenticate, validateBody(contactSchema), addContact);
router.put('/:id', authenticate, validateBody(contactSchema), updateContact);
router.delete('/:id', authenticate, deleteContact);

module.exports = router;
