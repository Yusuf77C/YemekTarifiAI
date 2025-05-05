const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Favorilere tarif ekle
exports.addToFavorites = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user._id;

        // Tarifin var olduğunu kontrol et
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Tarif bulunamadı' });
        }

        // Kullanıcıyı bul ve favorilere ekle
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Eğer tarif zaten favorilerdeyse hata döndür
        if (user.favorites.includes(recipeId)) {
            return res.status(400).json({ message: 'Bu tarif zaten favorilerinizde' });
        }

        // Favorilere ekle
        user.favorites.push(recipeId);
        await user.save();

        // Populate edilmiş favori listesini döndür
        const updatedUser = await User.findById(userId).populate({
            path: 'favorites',
            select: '_id title image'
        });

        res.json({
            message: 'Tarif favorilere eklendi',
            favorites: updatedUser.favorites
        });
    } catch (error) {
        console.error('Favori eklenirken hata:', error);
        res.status(500).json({ message: 'Favori eklenirken bir hata oluştu' });
    }
};

// Favorilerden tarif kaldır
exports.removeFromFavorites = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Favorilerden kaldır
        user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
        await user.save();

        // Populate edilmiş favori listesini döndür
        const updatedUser = await User.findById(userId).populate({
            path: 'favorites',
            select: '_id title image'
        });

        res.json({
            message: 'Tarif favorilerden kaldırıldı',
            favorites: updatedUser.favorites
        });
    } catch (error) {
        console.error('Favori kaldırılırken hata:', error);
        res.status(500).json({ message: 'Favori kaldırılırken bir hata oluştu' });
    }
};

// Kullanıcının favori tariflerini getir
exports.getUserFavorites = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: 'favorites',
            select: '_id title image'
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.json(user.favorites);
    } catch (error) {
        console.error('Favoriler getirilirken hata:', error);
        res.status(500).json({ message: 'Favoriler getirilirken bir hata oluştu' });
    }
}; 