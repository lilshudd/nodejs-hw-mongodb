const express = require('express');
const {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
} = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
} = require('../schemas/auth');

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.post(
  '/send-reset-email',
  validateBody(emailSchema),
  sendResetEmailController,
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

module.exports = router;
