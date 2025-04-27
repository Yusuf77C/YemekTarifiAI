const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
require('dotenv').config();

const seedRecipes = async () => {
    try {
        // MongoDB bağlantısı
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Admin kullanıcısını bul
        const adminUser = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminUser) {
            console.log('Admin kullanıcısı bulunamadı!');
            return;
        }

        // Mevcut tarifleri temizle
        await Recipe.deleteMany({});
        console.log('Mevcut tarifler silindi');

        // Örnek tarifler
        const recipes = [
            {
                title: 'Klasik Karnıyarık',
                description: 'Geleneksel Türk mutfağının vazgeçilmez lezzeti karnıyarık, patlıcanın en güzel haliyle sofralarınızda yer alacak.',
                ingredients: [
                    '6 adet patlıcan',
                    '300g kıyma',
                    '2 adet soğan',
                    '2 adet domates',
                    '2 adet sivri biber',
                    '3 diş sarımsak',
                    'Sıvı yağ',
                    'Tuz, karabiber',
                    'Maydanoz'
                ],
                instructions: [
                    'Patlıcanları alacalı soyup tuzlu suda bekletin.',
                    'Süzüp kuruladıktan sonra kızgın yağda kızartın.',
                    'Kıymayı soğan ve sarımsakla kavurun.',
                    'Domates ve biberleri ekleyip pişirin.',
                    'Patlıcanları tepsiye dizip üzerine kıymalı harçtan koyun.',
                    '180 derece fırında 20 dakika pişirin.'
                ],
                cookingTime: 60,
                difficulty: 'Orta',
                servings: 4,
                image: 'https://source.unsplash.com/random/800x600/?eggplant,stuffed',
                category: 'Ana Yemek',
                createdBy: adminUser._id,
                calories: 450
            },
            {
                title: 'Mantı',
                description: 'El açması mantı, yoğurt ve özel sosuyla geleneksel Türk mutfağının en sevilen lezzetlerinden.',
                ingredients: [
                    '3 su bardağı un',
                    '1 adet yumurta',
                    '1 çay kaşığı tuz',
                    'Su',
                    'Kıyma',
                    'Soğan',
                    'Yoğurt',
                    'Nane, pul biber',
                    'Tereyağı'
                ],
                instructions: [
                    'Un, yumurta ve tuzu yoğurun.',
                    'Hamuru dinlendirin.',
                    'İnce açın ve küçük kareler kesin.',
                    'Her karenin ortasına kıymalı harçtan koyun.',
                    'Kenarlarını kapatıp kaynayan suya atın.',
                    'Pişince süzüp servis tabağına alın.',
                    'Üzerine yoğurt ve sos dökün.'
                ],
                cookingTime: 90,
                difficulty: 'Zor',
                servings: 6,
                image: 'https://source.unsplash.com/random/800x600/?dumpling,turkish',
                category: 'Ana Yemek',
                createdBy: adminUser._id,
                calories: 380
            },
            {
                title: 'İçli Köfte',
                description: 'Bulgur ve kıyma ile hazırlanan dış harcı, cevizli iç harcıyla buluşan enfes bir lezzet.',
                ingredients: [
                    '2 su bardağı ince bulgur',
                    '250g kıyma',
                    'Soğan',
                    'Ceviz',
                    'Maydanoz',
                    'Karabiber, tuz',
                    'Kırmızı pul biber'
                ],
                instructions: [
                    'Bulguru ılık suda ıslatın.',
                    'Kıyma ve soğanı kavurun.',
                    'İç harcı için ceviz ve maydanozu karıştırın.',
                    'Bulguru yoğurun ve köfte şekli verin.',
                    'İçine harçtan koyup kapatın.',
                    'Kızartın veya fırında pişirin.'
                ],
                cookingTime: 75,
                difficulty: 'Orta',
                servings: 4,
                image: 'https://source.unsplash.com/random/800x600/?meatball,turkish',
                category: 'Meze',
                createdBy: adminUser._id,
                calories: 420
            },
            {
                title: 'Mercimek Çorbası',
                description: 'Geleneksel Türk mutfağının vazgeçilmez çorbası, besleyici ve lezzetli.',
                ingredients: [
                    '1 su bardağı kırmızı mercimek',
                    '1 adet soğan',
                    '1 adet havuç',
                    '1 adet patates',
                    '2 yemek kaşığı un',
                    '1 yemek kaşığı tereyağı',
                    'Tuz, karabiber, pul biber',
                    'Limon suyu'
                ],
                instructions: [
                    'Mercimeği yıkayıp süzün.',
                    'Soğan, havuç ve patatesi küp küp doğrayın.',
                    'Tereyağında soğanları kavurun.',
                    'Unu ekleyip kavurmaya devam edin.',
                    'Mercimek ve sebzeleri ekleyip su ilave edin.',
                    'Kaynayınca kısık ateşte pişirin.',
                    'Blenderdan geçirip servis yapın.'
                ],
                cookingTime: 30,
                difficulty: 'Kolay',
                servings: 4,
                image: 'https://source.unsplash.com/random/800x600/?lentil,soup',
                category: 'Çorba',
                createdBy: adminUser._id,
                calories: 180
            },
            {
                title: 'Künefe',
                description: 'Kadayıf ve peynirin muhteşem uyumu, şerbetiyle damaklarda iz bırakan bir tatlı.',
                ingredients: [
                    '500g kadayıf',
                    '300g künefe peyniri',
                    '200g tereyağı',
                    '2 su bardağı şeker',
                    '2 su bardağı su',
                    'Yarım limon suyu',
                    'Antep fıstığı'
                ],
                instructions: [
                    'Kadayıfı ince ince kıyın.',
                    'Tereyağını eritip kadayıfla karıştırın.',
                    'Yarısını tepsiye yayın.',
                    'Peyniri üzerine serpin.',
                    'Kalan kadayıfı kapatın.',
                    'Kızarana kadar pişirin.',
                    'Şerbetini döküp fıstıkla süsleyin.'
                ],
                cookingTime: 45,
                difficulty: 'Orta',
                servings: 6,
                image: 'https://source.unsplash.com/random/800x600/?dessert,turkish',
                category: 'Tatlı',
                createdBy: adminUser._id,
                calories: 550
            }
        ];

        // Tarifleri ekle
        await Recipe.insertMany(recipes);
        console.log('Örnek tarifler başarıyla eklendi');

        // Veritabanı bağlantısını kapat
        await mongoose.connection.close();
        console.log('Veritabanı bağlantısı kapatıldı');

    } catch (error) {
        console.error('Hata:', error);
    }
};

seedRecipes(); 