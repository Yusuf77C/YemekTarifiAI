const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

// Tüm tarifleri getir (herkese açık)
router.get('/', recipeController.getAllRecipes);

// Tarif detayını getir (herkese açık)
router.get('/:id', recipeController.getRecipeById);

// Yeni tarif ekle (sadece giriş yapmış kullanıcılar)
router.post('/', auth, recipeController.createRecipe);

// Tarifi güncelle (sadece tarifi oluşturan kullanıcı)
router.put('/:id', auth, recipeController.updateRecipe);

// Tarifi sil (sadece tarifi oluşturan kullanıcı)
router.delete('/:id', auth, recipeController.deleteRecipe);

router.post('/add-sample-recipes', recipeController.addSampleRecipes);


router.post('/:id/rate', auth, recipeController.rateRecipe);

router.get('/:id/ratings', recipeController.getRecipeRatings);

router.get('/:id/user-rating', auth, recipeController.getUserRating);


module.exports = router; 


router.post('/:id/rate', auth, recipeController.rateRecipe);
router.get('/:id/ratings', recipeController.getRecipeRatings);
router.get('/:id/user-rating', auth, recipeController.getUserRating);