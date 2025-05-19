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
  Alert
} from '@mui/material';
import { Favorite as FavoriteIcon } from '@mui/icons-material';
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        setError('Tarif yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

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
        await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(false);
        setSnackbar({
          open: true,
          message: 'Tarif favorilerden çıkarıldı',
          severity: 'success'
        });
      } else {
        await axios.post(`http://localhost:5000/api/favorites/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(true);
        setSnackbar({
          open: true,
          message: 'Tarif favorilere eklendi',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Bir hata oluştu',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {loading ? (
        <Typography>Yükleniyor...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : recipe ? (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {recipe.title}
            </Typography>
            <IconButton 
              onClick={handleFavoriteClick}
              color={isFavorite ? "error" : "default"}
            >
              <FavoriteIcon />
            </IconButton>
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

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Hazırlama Süresi: {recipe.prepTime} dakika
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Pişirme Süresi: {recipe.cookTime} dakika
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Porsiyon: {recipe.servings}
            </Typography>
          </Box>
        </Paper>
      ) : null}

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