const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Bir hata oluştu' });
});

module.exports = app; 