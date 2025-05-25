const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');

// Favorilere tarif ekle
router.post('/:recipeId', auth, favoriteController.addToFavorites);

// Favorilerden tarif kaldır
router.delete('/:recipeId', auth, favoriteController.removeFromFavorites);

// Kullanıcının favori tariflerini getir
router.get('/', auth, favoriteController.getUserFavorites);

// Favori kontrolü
router.get('/check/:recipeId', auth, async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            user: req.user._id,
            recipe: req.params.recipeId
        });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Favori kontrolü hatası:', error);
        res.status(500).json({ message: 'Favori kontrolü yapılırken bir hata oluştu' });
    }
});

// Favori ekle
router.post('/:recipeId', auth, async (req, res) => {
    try {
        const favorite = new Favorite({
            user: req.user._id,
            recipe: req.params.recipeId
        });
        await favorite.save();
        res.status(201).json({ message: 'Tarif favorilere eklendi' });
    } catch (error) {
        console.error('Favori ekleme hatası:', error);
        res.status(500).json({ message: 'Favori eklenirken bir hata oluştu' });
    }
});

// Favori sil
router.delete('/:recipeId', auth, async (req, res) => {
    try {
        await Favorite.findOneAndDelete({
            user: req.user._id,
            recipe: req.params.recipeId
        });
        res.json({ message: 'Tarif favorilerden çıkarıldı' });
    } catch (error) {
        console.error('Favori silme hatası:', error);
        res.status(500).json({ message: 'Favori silinirken bir hata oluştu' });
    }
});

// Favorileri getir
router.get('/', auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate('recipe')
            .sort({ createdAt: -1 });
        res.json(favorites);
    } catch (error) {
        console.error('Favoriler getirilirken hata:', error);
        res.status(500).json({ message: 'Favoriler getirilirken bir hata oluştu' });
    }
});

module.exports = router; 