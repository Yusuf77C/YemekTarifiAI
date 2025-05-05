import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemText,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import FavoriteButton from './FavoriteButton';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
                setRecipe(response.data);
                setLoading(false);
            } catch (err) {
                setError('Tarif yüklenirken bir hata oluştu.');
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!recipe) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="info">Tarif bulunamadı.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {recipe && (
                <Card>
                    <CardMedia
                        component="img"
                        height="400"
                        image={recipe.image}
                        alt={recipe.title}
                    />
                    <CardContent>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 2,
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
                                {recipe.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FavoriteButton recipeId={recipe._id} />
                            </Box>
                        </Box>
                        <Typography variant="h6" color="text.secondary" paragraph>
                            {recipe.description}
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Grid container spacing={2}>
                                <Grid>
                                    <Chip 
                                        label={`Pişirme Süresi: ${recipe.cookingTime} dk`}
                                        color="primary"
                                        sx={{ fontSize: '1rem', padding: '8px 16px' }}
                                    />
                                </Grid>
                                <Grid>
                                    <Chip 
                                        label={`Zorluk: ${recipe.difficulty}`}
                                        color="secondary"
                                        sx={{ fontSize: '1rem', padding: '8px 16px' }}
                                    />
                                </Grid>
                                <Grid>
                                    <Chip 
                                        label={`Porsiyon: ${recipe.servings} kişilik`}
                                        color="info"
                                        sx={{ fontSize: '1rem', padding: '8px 16px' }}
                                    />
                                </Grid>
                                <Grid>
                                    <Chip 
                                        label={`Kalori: ${recipe.calories} kcal`}
                                        color="success"
                                        sx={{ fontSize: '1rem', padding: '8px 16px' }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid>
                                <Typography variant="h5" gutterBottom>
                                    Malzemeler
                                </Typography>
                                <List>
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={ingredient} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid>
                                <Typography variant="h5" gutterBottom>
                                    Yapılışı
                                </Typography>
                                <List>
                                    {recipe.instructions.map((instruction, index) => (
                                        <ListItem key={index}>
                                            <ListItemText 
                                                primary={`${index + 1}. ${instruction}`}
                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default RecipeDetail; 