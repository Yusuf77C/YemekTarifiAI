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
        console.log('Gelen istek:', req.body);
        console.log('Kullanıcı bilgisi:', req.user);

        if (!req.user) {
            console.log('Kullanıcı bilgisi bulunamadı');
            return res.status(401).json({ message: 'Yetkilendirme hatası' });
        }

        // Veri doğrulama
        const requiredFields = ['title', 'description', 'ingredients', 'instructions', 'cookingTime', 'difficulty', 'servings', 'calories', 'category'];
        const missingFields = [];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            console.log('Eksik alanlar:', missingFields);
            return res.status(400).json({ 
                message: 'Eksik alanlar var',
                missingFields: missingFields
            });
        }

        // Malzemeler ve talimatlar dizisi kontrolü
        if (!Array.isArray(req.body.ingredients)) {
            console.log('Malzemeler dizi formatında değil:', req.body.ingredients);
            return res.status(400).json({ 
                message: 'Malzemeler dizi formatında olmalıdır',
                received: typeof req.body.ingredients
            });
        }

        if (!Array.isArray(req.body.instructions)) {
            console.log('Talimatlar dizi formatında değil:', req.body.instructions);
            return res.status(400).json({ 
                message: 'Talimatlar dizi formatında olmalıdır',
                received: typeof req.body.instructions
            });
        }

        // Zorluk seviyesi kontrolü
        const validDifficulties = ['Kolay', 'Orta', 'Zor'];
        if (!validDifficulties.includes(req.body.difficulty)) {
            return res.status(400).json({ 
                message: 'Geçersiz zorluk seviyesi',
                validDifficulties: validDifficulties
            });
        }

        // Kategori kontrolü
        const validCategories = ['Ana Yemek', 'Çorba', 'Salata', 'Tatlı', 'İçecek', 'Kahvaltı', 'Aperatif'];
        if (!validCategories.includes(req.body.category)) {
            return res.status(400).json({ 
                message: 'Geçersiz kategori',
                validCategories: validCategories
            });
        }

        const recipe = new Recipe({
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            ingredients: req.body.ingredients.map(item => item.trim()),
            instructions: req.body.instructions.map(item => item.trim()),
            cookingTime: parseInt(req.body.cookingTime),
            difficulty: req.body.difficulty,
            servings: parseInt(req.body.servings),
            calories: parseInt(req.body.calories),
            image: req.body.image ? req.body.image.trim() : 'https://source.unsplash.com/random/800x600/?food',
            category: req.body.category,
            createdBy: req.user._id
        });

        console.log('Oluşturulan tarif:', recipe);

        const savedRecipe = await recipe.save();
        console.log('Kaydedilen tarif:', savedRecipe);
        
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error('Tarif eklenirken hata:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Geçersiz veri',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
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