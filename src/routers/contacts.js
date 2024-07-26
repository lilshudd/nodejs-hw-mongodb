const express = require('express');
const router = express.Router();
const {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
} = require('../controllers/contacts');
const authenticate = require('../middlewares/authenticate');
const validateBody = require('../middlewares/validateBody');
const { contactSchema } = require('../schemas/contact');
const upload = require('../middlewares/multer');

router.get('/', authenticate, getContactsController);
router.get('/:id', authenticate, getContactByIdController);
router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchema),
  addContactController,
);
router.patch(
  '/:id',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchema),
  updateContactController,
);
router.delete('/:id', authenticate, deleteContactController);

module.exports = router;
