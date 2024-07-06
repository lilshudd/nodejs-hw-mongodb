const express = require('express');
const {
  registerController,
  loginController,
  refreshController,
  logoutController,
} = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const { registerSchema, loginSchema } = require('../schemas/auth');

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);

module.exports = router;
