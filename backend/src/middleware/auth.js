const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kullanıcıyı bul
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'Geçersiz token' });
        }

        // Kullanıcı bilgisini request nesnesine ekle
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware hatası:', error);
        res.status(401).json({ message: 'Lütfen giriş yapın' });
    }
};

module.exports = auth; 