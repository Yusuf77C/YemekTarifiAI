const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Favorite = require('../models/Favorite');

// Favori kontrolü
exports.checkFavorite = async (req, res) => {
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
};

// Favorilere tarif ekle
exports.addToFavorites = async (req, res) => {
    try {
        const favorite = new Favorite({
            user: req.user._id,
            recipe: req.params.recipeId
        });
        await favorite.save();
        res.status(201).json({ message: 'Tarif favorilere eklendi' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Bu tarif zaten favorilerinizde' });
        }
        console.error('Favori ekleme hatası:', error);
        res.status(500).json({ message: 'Favori eklenirken bir hata oluştu' });
    }
};

// Favorilerden tarif kaldır
exports.removeFromFavorites = async (req, res) => {
    try {
        const result = await Favorite.findOneAndDelete({
            user: req.user._id,
            recipe: req.params.recipeId
        });

        if (!result) {
            return res.status(404).json({ message: 'Favori bulunamadı' });
        }

        res.json({ message: 'Tarif favorilerden çıkarıldı' });
    } catch (error) {
        console.error('Favori silme hatası:', error);
        res.status(500).json({ message: 'Favori silinirken bir hata oluştu' });
    }
};

// Kullanıcının favori tariflerini getir
exports.getUserFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate('recipe')
            .sort({ createdAt: -1 });
        res.json(favorites);
    } catch (error) {
        console.error('Favoriler getirilirken hata:', error);
        res.status(500).json({ message: 'Favoriler getirilirken bir hata oluştu' });
    }
}; 