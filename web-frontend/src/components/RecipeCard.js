import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  return (
    <Link 
      to={`/recipe/${recipe._id}`} 
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          },
          cursor: 'pointer'
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={recipe.image}
          alt={recipe.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {recipe.title}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {recipe.cookingTime} dk
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {recipe.calories} kcal
            </Typography>
          </Box>
        </CardContent>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: '#ff9800',
            '&:hover': {
              backgroundColor: '#f57c00'
            }
          }}
          fullWidth
        >
          Detayları Gör
        </Button>
      </Card>
    </Link>
  );
};

export default RecipeCard; 