import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFavorites(response.data);
        } catch (error) {
            console.error('Favoriler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Favori Tariflerim
            </Typography>

            {favorites.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    Henüz favori tarifiniz bulunmamaktadır.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {favorites.map((recipe) => (
                        <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        transition: 'transform 0.2s'
                                    }
                                }}
                                onClick={() => navigate(`/recipe/${recipe._id}`)}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={recipe.image}
                                    alt={recipe.title}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="h2">
                                        {recipe.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {recipe.description}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            ⏱ {recipe.cookingTime} dk
                                        </Typography>
                                        <Typography variant="body2">
                                            🍽 {recipe.servings} porsiyon
                                        </Typography>
                                        <Typography variant="body2">
                                            🔥 {recipe.calories} kalori
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default FavoritesPage; 