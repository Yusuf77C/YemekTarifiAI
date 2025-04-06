const Recipe = require('../models/Recipe');

// Tüm tarifleri getir
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        console.error('Tarifler getirilirken hata:', error);
        res.status(500).json({ message: 'Tarifler getirilirken bir hata oluştu' });
    }
};

// Yeni tarif ekle
exports.createRecipe = async (req, res) => {
    try {
        const recipe = new Recipe({
            ...req.body,
            createdBy: req.user._id
        });
        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        console.error('Tarif eklenirken hata:', error);
        res.status(500).json({ message: 'Tarif eklenirken bir hata oluştu' });
    }
};

// Tarif detayını getir
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('createdBy', 'username')
            .populate('ratings.user', 'username');
        
        if (!recipe) {
            return res.status(404).json({ message: 'Tarif bulunamadı' });
        }
        
        res.json(recipe);
    } catch (error) {
        console.error('Tarif detayı getirilirken hata:', error);
        res.status(500).json({ message: 'Tarif detayı getirilirken bir hata oluştu' });
    }
};

// Tarifi güncelle
exports.updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ message: 'Tarif bulunamadı' });
        }

        // Sadece tarifi oluşturan kullanıcı güncelleyebilir
        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Bu tarifi güncelleme yetkiniz yok' });
        }

        Object.assign(recipe, req.body);
        await recipe.save();
        
        res.json(recipe);
    } catch (error) {
        console.error('Tarif güncellenirken hata:', error);
        res.status(500).json({ message: 'Tarif güncellenirken bir hata oluştu' });
    }
};

// Tarifi sil
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ message: 'Tarif bulunamadı' });
        }

        // Sadece tarifi oluşturan kullanıcı silebilir
        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Bu tarifi silme yetkiniz yok' });
        }

        await recipe.remove();
        res.json({ message: 'Tarif başarıyla silindi' });
    } catch (error) {
        console.error('Tarif silinirken hata:', error);
        res.status(500).json({ message: 'Tarif silinirken bir hata oluştu' });
    }
}; 