const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', auth, refreshToken);

module.exports = router; 