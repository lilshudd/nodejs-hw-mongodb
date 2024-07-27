const express = require('express');
const multer = require('multer');
const authenticate = require('../middlewares/authenticate');
const {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} = require('../controllers/contacts');
const validateBody = require('../middlewares/validateBody');
const {
  createContactSchema,
  updateContactSchema,
} = require('../schemas/contact');

const upload = multer();

const router = express.Router();

router.use(authenticate);

router.get('/', getContactsController);
router.get('/:id', getContactByIdController);
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  createContactController,
);
router.patch(
  '/:id',
  upload.single('photo'),
  validateBody(updateContactSchema),
  updateContactController,
);
router.delete('/:id', deleteContactController);

module.exports = router;
