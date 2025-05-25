import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Rating,
  Card,
  CardMedia,
  CardContent,
  Chip
} from '@mui/material';
import { Favorite as FavoriteIcon, AccessTime, Restaurant, LocalFireDepartment } from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://192.168.2.3:5000';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/recipes/${id}`);
        setRecipe(response.data);
        setLoading(false);
        fetchRatings();
        checkIfFavorite();
      } catch (error) {
        setError('Tarif yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/recipes/${id}/ratings`);
      if (response.data && typeof response.data.averageRating === 'number') {
        setAverageRating(response.data.averageRating);
        setRatingCount(response.data.ratingCount || 0);
      }

      const token = localStorage.getItem('token');
      if (token) {
        const userResponse = await axios.get(`${API_URL}/api/recipes/${id}/user-rating`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserRating(userResponse.data.rating || 0);
      }
    } catch (error) {
      console.error('Puanlar yüklenirken hata:', error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/favorites/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    }
  };

  const handleRating = async (newValue) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Puan vermek için giriş yapmalısınız',
          severity: 'warning'
        });
        return;
      }

      await axios.post(
        `${API_URL}/api/recipes/${id}/rate`,
        { rating: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserRating(newValue);
      fetchRatings();
      setSnackbar({
        open: true,
        message: 'Puanınız başarıyla kaydedildi',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Puan verilirken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleFavoriteClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: 'Favorilere eklemek için giriş yapmalısınız',
          severity: 'warning'
        });
        return;
      }

      if (isFavorite) {
        try {
          await axios.delete(`${API_URL}/api/favorites/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFavorite(false);
          setSnackbar({
            open: true,
            message: 'Tarif favorilerden çıkarıldı',
            severity: 'success'
          });
        } catch (error) {
          console.error('Favoriden çıkarma hatası:', error);
          setSnackbar({
            open: true,
            message: 'Favorilerden çıkarılırken bir hata oluştu',
            severity: 'error'
          });
        }
      } else {
        try {
          await axios.post(`${API_URL}/api/favorites/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsFavorite(true);
          setSnackbar({
            open: true,
            message: 'Tarif favorilere eklendi',
            severity: 'success'
          });
        } catch (error) {
          console.error('Favoriye ekleme hatası:', error);
          setSnackbar({
            open: true,
            message: 'Favorilere eklenirken bir hata oluştu',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error);
      setSnackbar({
        open: true,
        message: 'Bir hata oluştu',
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Yükleniyor...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardMedia
          component="img"
          height="400"
          image={recipe.image}
          alt={recipe.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {recipe.title}
            </Typography>
            <IconButton 
              onClick={handleFavoriteClick}
              color={isFavorite ? "error" : "default"}
              size="large"
            >
              <FavoriteIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Rating
              name="recipe-rating"
              value={userRating}
              onChange={(event, newValue) => handleRating(newValue)}
              precision={1}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#FF9800',
                },
                '& .MuiRating-iconHover': {
                  color: '#FF9800',
                },
                '& .MuiRating-iconEmpty': {
                  color: '#FFD700',
                },
              }}
            />
            <Typography variant="body1" sx={{ ml: 2, color: '#666' }}>
              {averageRating.toFixed(1)} / 5 ({ratingCount} değerlendirme)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Chip
              icon={<AccessTime />}
              label={`${recipe.cookingTime} dakika`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Restaurant />}
              label={`${recipe.servings} porsiyon`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<LocalFireDepartment />}
              label={`${recipe.calories} kalori`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={recipe.difficulty}
              color={
                recipe.difficulty === 'Kolay' ? 'success' :
                recipe.difficulty === 'Orta' ? 'warning' : 'error'
              }
            />
          </Box>

          <Typography variant="subtitle1" color="text.secondary" paragraph>
            {recipe.description}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
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

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Hazırlanışı
              </Typography>
              <List>
                {recipe.instructions.map((instruction, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`${index + 1}. Adım`}
                      secondary={instruction}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecipeDetail; 