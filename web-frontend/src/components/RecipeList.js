import React from 'react';
import { Grid } from '@mui/material';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes }) => {
  return (
    <Grid 
      container 
      spacing={2} 
      sx={{ 
        width: '100%',
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
      }}
    >
      {recipes.map((recipe) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={3} 
          key={recipe._id}
          sx={{ 
            flex: '0 0 23%',
            maxWidth: '23%',
            marginBottom: '20px'
          }}
        >
          <RecipeCard recipe={recipe} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeList; 