const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const clearUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB bağlantısı başarılı');

        await User.deleteMany({});
        console.log('Tüm kullanıcılar silindi');

        await mongoose.connection.close();
        console.log('Veritabanı bağlantısı kapatıldı');
    } catch (error) {
        console.error('Hata:', error);
    }
};

clearUsers(); 