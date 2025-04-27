const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Başlık zorunludur'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Açıklama zorunludur'],
        trim: true
    },
    ingredients: {
        type: [String],
        required: [true, 'Malzemeler zorunludur'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'En az bir malzeme eklenmelidir'
        }
    },
    instructions: {
        type: [String],
        required: [true, 'Talimatlar zorunludur'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'En az bir talimat eklenmelidir'
        }
    },
    cookingTime: {
        type: Number,
        required: [true, 'Pişirme süresi zorunludur'],
        min: [1, 'Pişirme süresi 1 dakikadan az olamaz']
    },
    difficulty: {
        type: String,
        required: [true, 'Zorluk seviyesi zorunludur'],
        enum: {
            values: ['Kolay', 'Orta', 'Zor'],
            message: 'Zorluk seviyesi Kolay, Orta veya Zor olmalıdır'
        }
    },
    servings: {
        type: Number,
        required: [true, 'Porsiyon sayısı zorunludur'],
        min: [1, 'Porsiyon sayısı 1\'den az olamaz']
    },
    calories: {
        type: Number,
        required: [true, 'Kalori bilgisi zorunludur'],
        min: [0, 'Kalori 0\'dan az olamaz']
    },
    image: {
        type: String,
        default: 'https://source.unsplash.com/random/800x600/?food'
    },
    category: {
        type: String,
        required: [true, 'Kategori zorunludur'],
        enum: {
            values: ['Ana Yemek', 'Çorba', 'Salata', 'Tatlı', 'İçecek', 'Kahvaltı', 'Aperatif'],
            message: 'Geçersiz kategori'
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema); 