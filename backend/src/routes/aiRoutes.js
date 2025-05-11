const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');

// Test route'u
router.get('/test', (req, res) => {
  res.json({ message: 'AI route çalışıyor' });
});

// Chat route'u
router.post('/chat', chat);

module.exports = router; 