const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Token'ı header'dan al
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Geçersiz token formatı' });
        }

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Kullanıcıyı bul
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Token'daki email ile kullanıcının email'ini karşılaştır
        if (decoded.email !== user.email) {
            return res.status(401).json({ message: 'Geçersiz token' });
        }

        // Kullanıcı bilgisini request nesnesine ekle
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware hatası:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Geçersiz token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token süresi dolmuş' });
        }
        res.status(401).json({ message: 'Yetkilendirme hatası' });
    }
};

module.exports = auth; 