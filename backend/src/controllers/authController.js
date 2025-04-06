const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Token oluşturma
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
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
                token: generateToken(user._id)
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
        console.log('Giriş isteği alındı:', req.body); // Debug log

        const { email, password } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ email });
        console.log('Kullanıcı bulundu:', user ? 'Evet' : 'Hayır'); // Debug log
        if (user) {
            console.log('Kullanıcı detayları:', {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        }

        if (user && user.matchPassword(password)) {
            console.log('Şifre doğru, giriş başarılı'); // Debug log
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            console.log('Giriş başarısız - Kullanıcı veya şifre hatalı'); // Debug log
            res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
        }
    } catch (error) {
        console.error('Giriş hatası:', error); // Debug log
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser
}; 