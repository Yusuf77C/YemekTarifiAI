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

// 10 yeni yemek ekle
exports.addSampleRecipes = async (req, res) => {
    try {
        console.log('Örnek tarifler ekleniyor...');
        
        // Önce mevcut tarifleri temizleyelim
        await Recipe.deleteMany({});
        console.log('Mevcut tarifler temizlendi');

        const sampleRecipes = [
            {
                title: "Mercimek Çorbası",
                description: "Geleneksel Türk mutfağının vazgeçilmez çorbası",
                ingredients: ["1 su bardağı kırmızı mercimek", "1 adet soğan", "1 adet havuç", "2 yemek kaşığı un", "1 yemek kaşığı tereyağı", "1 litre su", "Tuz, karabiber"],
                instructions: ["Mercimeği yıkayın", "Soğan ve havucu doğrayın", "Tereyağında kavurun", "Mercimeği ekleyin", "Su ekleyin ve pişirin", "Blenderdan geçirin"],
                cookingTime: 30,
                difficulty: "Kolay",
                servings: 4,
                calories: 200,
                image: "https://source.unsplash.com/random/800x600/?lentil,soup",
                category: "Çorba",
                createdBy: "admin"
            },
            {
                title: "İskender",
                description: "Bursa'nın meşhur yemeği",
                ingredients: ["500g döner eti", "4 adet pide", "2 su bardağı domates sosu", "2 su bardağı yoğurt", "2 yemek kaşığı tereyağı", "Tuz, karabiber"],
                instructions: ["Döneri ince dilimler halinde kesin", "Pideleri ısıtın", "Domates sosunu hazırlayın", "Yoğurdu yanında servis yapın", "Tereyağını kızdırıp üzerine dökün"],
                cookingTime: 45,
                difficulty: "Orta",
                servings: 4,
                calories: 600,
                image: "https://source.unsplash.com/random/800x600/?doner,kebab",
                category: "Ana Yemek",
                createdBy: "admin"
            },
            {
                title: "Mantı",
                description: "Geleneksel Türk mutfağının en özel yemeklerinden biri",
                ingredients: ["3 su bardağı un", "1 adet yumurta", "1 su bardağı su", "250g kıyma", "1 adet soğan", "2 su bardağı yoğurt", "2 yemek kaşığı tereyağı", "Tuz, karabiber"],
                instructions: ["Hamur için un, yumurta ve suyu yoğurun", "Hamuru ince açın", "Küçük kareler kesin", "İç harç hazırlayın", "Her kareye iç harçtan koyup kapatın", "Kaynar suda haşlayın"],
                cookingTime: 90,
                difficulty: "Zor",
                servings: 4,
                calories: 500,
                image: "https://source.unsplash.com/random/800x600/?dumpling,turkish",
                category: "Ana Yemek",
                createdBy: "admin"
            },
            {
                title: "Baklava",
                description: "Türk mutfağının en meşhur tatlısı",
                ingredients: ["500g yufka", "250g ceviz", "250g tereyağı", "2 su bardağı şeker", "2 su bardağı su", "1 yemek kaşığı limon suyu"],
                instructions: ["Yufkaları açın", "Ceviz serpin", "Tereyağını eritin", "Fırında pişirin", "Şerbet hazırlayın", "Şerbeti dökün"],
                cookingTime: 60,
                difficulty: "Orta",
                servings: 8,
                calories: 400,
                image: "https://source.unsplash.com/random/800x600/?baklava,dessert",
                category: "Tatlı",
                createdBy: "admin"
            },
            {
                title: "Menemen",
                description: "Türk kahvaltılarının vazgeçilmez lezzeti",
                ingredients: ["4 adet yumurta", "2 adet domates", "2 adet yeşil biber", "1 adet soğan", "2 yemek kaşığı zeytinyağı", "Tuz, karabiber"],
                instructions: ["Soğanı doğrayın", "Biberleri doğrayın", "Domatesleri doğrayın", "Zeytinyağında kavurun", "Yumurtaları kırın", "Karıştırarak pişirin"],
                cookingTime: 20,
                difficulty: "Kolay",
                servings: 2,
                calories: 300,
                image: "https://source.unsplash.com/random/800x600/?scrambled,eggs",
                category: "Kahvaltı",
                createdBy: "admin"
            },
            {
                title: "Lahmacun",
                description: "İnce hamur üzerine kıyma, soğan ve baharatlarla hazırlanan lezzet",
                ingredients: ["500g un", "1 su bardağı su", "250g kıyma", "1 adet soğan", "2 adet domates", "2 yemek kaşığı salça", "Tuz, karabiber, kırmızı biber"],
                instructions: ["Hamur için un ve suyu yoğurun", "Hamuru ince açın", "İç harç hazırlayın", "Harçı hamurun üzerine yayın", "Fırında pişirin", "Sıcak servis yapın"],
                cookingTime: 30,
                difficulty: "Orta",
                servings: 4,
                calories: 350,
                image: "https://source.unsplash.com/random/800x600/?lahmacun,turkish",
                category: "Ana Yemek",
                createdBy: "admin"
            },
            {
                title: "Pide",
                description: "Türk mutfağının geleneksel hamur işi",
                ingredients: ["500g un", "1 su bardağı su", "1 paket maya", "250g kıyma", "1 adet soğan", "2 yemek kaşığı tereyağı", "Tuz"],
                instructions: ["Hamur için un, su ve mayayı yoğurun", "Mayalanmaya bırakın", "İç harç hazırlayın", "Hamuru açın", "Fırında pişirin", "Tereyağı ile servis yapın"],
                cookingTime: 45,
                difficulty: "Orta",
                servings: 4,
                calories: 400,
                image: "https://source.unsplash.com/random/800x600/?pide,turkish",
                category: "Ana Yemek",
                createdBy: "admin"
            },
            {
                title: "Künefe",
                description: "Türk mutfağının meşhur tatlısı",
                ingredients: ["500g kadayıf", "250g künefe peyniri", "250g tereyağı", "2 su bardağı şeker", "2 su bardağı su", "1 yemek kaşığı limon suyu"],
                instructions: ["Kadayıfı tereyağı ile yağlayın", "Yarısını tepsiye yayın", "Peyniri yerleştirin", "Kalan kadayıfı üzerine yayın", "Fırında pişirin", "Şerbetini döküp servis yapın"],
                cookingTime: 40,
                difficulty: "Orta",
                servings: 6,
                calories: 450,
                image: "https://source.unsplash.com/random/800x600/?kunefe,dessert",
                category: "Tatlı",
                createdBy: "admin"
            },
            {
                title: "Çiğ Köfte",
                description: "Geleneksel Türk mutfağının lezzetli atıştırmalığı",
                ingredients: ["2 su bardağı ince bulgur", "1 adet soğan", "2 yemek kaşığı salça", "2 yemek kaşığı isot", "Tuz, karabiber"],
                instructions: ["Bulguru ılık suda bekletin", "Soğanı rendeleyin", "Tüm malzemeleri yoğurun", "Hamur kıvamına gelene kadar yoğurun", "Şekil verip servis yapın"],
                cookingTime: 30,
                difficulty: "Orta",
                servings: 4,
                calories: 300,
                image: "https://source.unsplash.com/random/800x600/?cig,kofte",
                category: "Meze",
                createdBy: "admin"
            },
            {
                title: "Sütlaç",
                description: "Türk mutfağının geleneksel sütlü tatlısı",
                ingredients: ["1 su bardağı pirinç", "1 litre süt", "1 su bardağı şeker", "1 yemek kaşığı nişasta", "Tarçın"],
                instructions: ["Pirinci yıkayıp haşlayın", "Sütü ekleyin", "Koyulaşana kadar pişirin", "Şeker ve nişastayı ekleyin", "Fırında pişirin", "Tarçın serpip servis yapın"],
                cookingTime: 60,
                difficulty: "Kolay",
                servings: 6,
                calories: 250,
                image: "https://source.unsplash.com/random/800x600/?rice,pudding",
                category: "Tatlı",
                createdBy: "admin"
            }
        ];

        console.log('Tarifler hazır, MongoDB\'ye kaydediliyor...');
        const savedRecipes = await Recipe.insertMany(sampleRecipes);
        console.log('Kaydedilen tarifler:', savedRecipes);
        
        res.status(201).json(savedRecipes);
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ message: error.message });
    }
}; 