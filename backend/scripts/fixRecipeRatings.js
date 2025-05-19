const mongoose = require('mongoose');
const Recipe = require('../src/models/Recipe');

const MONGO_URI = 'mongodb+srv://yusuf:123@cluster0.ynghg.mongodb.net/yemek-tarifi-ai?retryWrites=true&w=majority&appName=Cluster0&authSource=admin&dbName=yemek-tarifi-ai'; // Buraya kendi bağlantı adresini yaz

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const recipes = await Recipe.find();
    for (const recipe of recipes) {
      if (!recipe.ratings) recipe.ratings = [];
      const sum = recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      recipe.averageRating = recipe.ratings.length ? sum / recipe.ratings.length : 0;
      recipe.ratingCount = recipe.ratings.length;
      await recipe.save();
      console.log(`Güncellendi: ${recipe.title} - Ortalama: ${recipe.averageRating}, Sayı: ${recipe.ratingCount}`);
    }
    mongoose.disconnect();
    console.log('Tüm tarifler güncellendi!');
  })
  .catch(err => {
    console.error('Hata:', err);
  }); 