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

router.use(authenticate);

router.get('/', getContactsController);
router.get('/:id', getContactByIdController);
router.post('/', validateBody(contactSchema), addContactController);
router.patch('/:id', validateBody(contactSchema), updateContactController);
router.delete('/:id', deleteContactController);

module.exports = router;
