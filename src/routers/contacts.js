const express = require('express');
const {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
} = require('../controllers/contacts');
const validateBody = require('../middlewares/validateBody');
const { contactSchema } = require('../schemas/contact');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/', authenticate, getContactsController);
router.get('/:id', authenticate, getContactByIdController);
router.post(
  '/',
  authenticate,
  validateBody(contactSchema),
  addContactController,
);
router.patch(
  '/:id',
  authenticate,
  validateBody(contactSchema),
  updateContactController,
);
router.delete('/:id', authenticate, deleteContactController);

module.exports = router;
