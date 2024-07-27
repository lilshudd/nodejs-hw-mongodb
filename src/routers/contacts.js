const express = require('express');
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

const router = express.Router();

router.get('/', getContactsController);
router.get('/:id', getContactByIdController);
router.post('/', validateBody(createContactSchema), createContactController);
router.put('/:id', validateBody(updateContactSchema), updateContactController);
router.delete('/:id', deleteContactController);

module.exports = router;
