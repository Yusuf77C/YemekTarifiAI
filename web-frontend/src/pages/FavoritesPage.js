import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://192.168.2.3:5000';

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
    
            const response = await axios.get(`${API_URL}/api/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // API'den gelen veriyi düzenle ve null kontrolü ekle
            const formattedFavorites = response.data
                .filter(fav => fav && fav.recipe) // Önce fav ve fav.recipe'nin varlığını kontrol et
                .map(fav => fav.recipe)
                .filter(recipe => recipe && recipe._id); // Geçerli recipe objelerini filtrele
    
            setFavorites(formattedFavorites);
        } catch (error) {
            console.error('Favoriler yüklenirken hata:', error);
            setFavorites([]); // Hata durumunda boş array set et
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
                                    component="img"//Önceki
                                    height="200"
                                    image={recipe?.image || '/default-recipe-image.jpg'}
                                    alt={recipe?.title || 'Tarif görseli'}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default-recipe-image.jpg';
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="h2">
                                        {recipe.title || 'İsimsiz Tarif'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {recipe.description || 'Açıklama bulunmuyor'}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            ⏱ {recipe.cookingTime || 0} dk
                                        </Typography>
                                        <Typography variant="body2">
                                            🍽 {recipe.servings || 0} porsiyon
                                        </Typography>
                                        <Typography variant="body2">
                                            🔥 {recipe.calories || 0} kalori
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