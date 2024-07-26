const express = require('express');
const router = express.Router();
const {
  sendResetEmailController,
  resetPasswordController,
} = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const {
  sendResetEmailSchema,
  resetPasswordSchema,
} = require('../schemas/auth');

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  sendResetEmailController,
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

module.exports = router;
