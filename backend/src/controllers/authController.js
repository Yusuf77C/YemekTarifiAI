const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Token oluşturma
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role 
        }, 
        process.env.JWT_SECRET || 'your-secret-key',
        {
            expiresIn: '24h' // Token süresini 24 saat olarak ayarladık
        }
    );
};

// Token yenileme fonksiyonu
const refreshToken = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Token bulunamadı' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
        }

        const newToken = generateToken(user);
        res.json({
            token: newToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Token yenileme hatası:', error);
        res.status(401).json({ message: 'Token yenilenemedi' });
    }
};

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        console.log('Kayıt isteği alındı:', req.body); // Debug log

        const { username, email, password } = req.body;

        // Kullanıcı var mı kontrol et
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Kullanıcı zaten mevcut:', email); // Debug log
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı' });
        }

        // Yeni kullanıcı oluştur
        const user = await User.create({
            username,
            email,
            password
        });

        console.log('Kullanıcı oluşturuldu:', user); // Debug log

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user)
            });
        }
    } catch (error) {
        console.error('Kayıt hatası:', error); // Debug log
        res.status(400).json({ message: error.message });
    }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ email });
        
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user)
            });
        } else {
            res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshToken
}; 