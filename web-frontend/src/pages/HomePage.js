import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Paper,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

// Özel stil bileşenleri
const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#FFF3E0', // Açık turuncu arka plan
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#FF9800', // Turuncu buton rengi
    color: 'white',
    '&:hover': {
        backgroundColor: '#F57C00',
    },
}));

const HomePage = ({ user }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = recipes.filter(recipe =>
                recipe.title.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
            setFilteredRecipes(filtered);
        } else {
            setFilteredRecipes([]);
        }
    }, [searchTerm, recipes]);

    const fetchRecipes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recipes');
            if (!response.ok) {
                throw new Error('Tarifler yüklenirken bir hata oluştu');
            }
            const data = await response.json();
            setRecipes(data);
        } catch (err) {
            setError(err.message);
            console.error('Tarifler yüklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (recipe) => {
        if (recipe) {
            navigate(`/recipe/${recipe._id}`);
        }
    };

    const handleRecipeClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`);
    };

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

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Yemek Tarifleri
                </Typography>
                {user && (
                    <Box sx={{ position: 'relative' }}>
                        <Autocomplete
                            freeSolo
                            options={filteredRecipes}
                            getOptionLabel={(option) => option.title}
                            onChange={(event, newValue) => handleSearch(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Yemek ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: 'primary.main' }} />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            backgroundColor: 'background.paper',
                                            borderRadius: 2,
                                            boxShadow: 1,
                                            '&:hover': {
                                                boxShadow: 2
                                            }
                                        }
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <ListItem {...props} component="div">
                                    <ListItemText 
                                        primary={option.title}
                                        secondary={`${option.cookingTime} dk • ${option.difficulty}`}
                                    />
                                </ListItem>
                            )}
                            PaperComponent={({ children }) => (
                                <Paper 
                                    sx={{ 
                                        mt: 1,
                                        boxShadow: 3,
                                        borderRadius: 2
                                    }}
                                >
                                    {children}
                                </Paper>
                            )}
                        />
                    </Box>
                )}
            </Box>

            {/* Başlık Bölümü */}
            <StyledPaper elevation={3}>
                <Typography 
                    variant="h2" 
                    component="h1" 
                    align="center" 
                    gutterBottom
                    sx={{ 
                        color: '#E65100', // Koyu turuncu başlık rengi
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                        mb: 3
                    }}
                >
                    Yemek Tarifi AI
                </Typography>
                <Typography 
                    variant="h5" 
                    align="center" 
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Yapay zeka destekli yemek tarifleri ve öneriler
                </Typography>
            </StyledPaper>

            {/* Tarifler */}
            <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                sx={{ 
                    color: '#E65100',
                    mb: 3,
                    fontWeight: 'bold'
                }}
            >
                Tarifler
            </Typography>

            <Grid container spacing={4}>
                {recipes.map((recipe) => (
                    <Grid item key={recipe._id} xs={12} sm={6} md={4}>
                        <StyledCard 
                            onClick={() => handleRecipeClick(recipe._id)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={recipe.image}
                                alt={recipe.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {recipe.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {recipe.description}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        {recipe.cookingTime} dk • {recipe.difficulty}
                                    </Typography>
                                    <StyledButton size="small">
                                        Detayları Gör
                                    </StyledButton>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage; 