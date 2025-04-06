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