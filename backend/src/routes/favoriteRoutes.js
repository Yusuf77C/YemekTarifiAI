const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

// Favorilere tarif ekle
router.post('/:recipeId', auth, favoriteController.addToFavorites);

// Favorilerden tarif kaldır
router.delete('/:recipeId', auth, favoriteController.removeFromFavorites);

// Kullanıcının favori tariflerini getir
router.get('/', auth, favoriteController.getUserFavorites);

module.exports = router; 