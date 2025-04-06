const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        // MongoDB'ye bağlan
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        // Admin kullanıcısını kontrol et
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });
        if (adminExists) {
            console.log('Admin kullanıcısı zaten mevcut');
            await mongoose.connection.close();
            return;
        }

        // Admin kullanıcısını oluştur
        const adminUser = new User({
            username: 'admin',
            email: 'admin@gmail.com',
            password: 'admin123',
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin kullanıcısı oluşturuldu');

        await mongoose.connection.close();
        console.log('Veritabanı bağlantısı kapatıldı');
    } catch (error) {
        console.error('Hata:', error);
    }
};

// Script'i çalıştır
seedAdmin(); 