const express = require('express');
const {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} = require('../controllers/contacts');
const authenticate = require('../middlewares/authenticate');
const validateBody = require('../middlewares/validateBody');
const upload = require('../middlewares/upload');
const { contactSchema } = require('../schemas/contact');

const router = express.Router();

router.get('/', authenticate, getContactsController);
router.get('/:contactId', authenticate, getContactByIdController);
router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchema),
  createContactController,
);
router.patch(
  '/:contactId',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchema),
  updateContactController,
);
router.delete('/:contactId', authenticate, deleteContactController);

module.exports = router;
