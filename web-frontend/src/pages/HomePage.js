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
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { FilterList as FilterListIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import RecipeList from '../components/RecipeList';
import AIChatBot from '../components/AIChatBot';

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
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        duration: [0, 180],
        difficulty: '',
        calories: [0, 1000],
        servings: [1, 10],
        type: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = recipes.filter(recipe =>
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRecipes(filtered);
        } else {
            setFilteredRecipes(recipes);
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

    const handleFilterChange = (name) => (event) => {
        setFilters({
            ...filters,
            [name]: event.target.value
        });
    };

    const handleRangeChange = (name) => (event, newValue) => {
        setFilters({
            ...filters,
            [name]: newValue
        });
    };

    const handleFilterApply = () => {
        const filtered = recipes.filter(recipe => {
            // Süre filtresi
            if (filters.duration[0] > 0 && recipe.cookingTime < filters.duration[0]) return false;
            if (filters.duration[1] < 180 && recipe.cookingTime > filters.duration[1]) return false;

            // Zorluk seviyesi filtresi
            if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;

            // Kalori filtresi
            if (filters.calories[0] > 0 && recipe.calories < filters.calories[0]) return false;
            if (filters.calories[1] < 1000 && recipe.calories > filters.calories[1]) return false;

            // Porsiyon sayısı filtresi
            if (filters.servings[0] > 1 && recipe.servings < filters.servings[0]) return false;
            if (filters.servings[1] < 10 && recipe.servings > filters.servings[1]) return false;

            // Yemek tipi filtresi
            if (filters.type && recipe.category !== filters.type) return false;

            return true;
        });

        setFilteredRecipes(filtered);
        setFilterOpen(false);
    };

    const handleFilterReset = () => {
        setFilters({
            duration: [0, 180],
            difficulty: '',
            calories: [0, 1000],
            servings: [1, 10],
            type: ''
        });
        setFilteredRecipes(recipes);
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Yemek Tarifleri
                </Typography>
                {user && (
                    <Box sx={{ 
                        position: 'relative',
                        width: '100%',
                        maxWidth: '800px',
                        margin: '0 auto',
                        mb: 4
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <IconButton 
                                onClick={() => setFilterOpen(true)}
                                color="primary"
                                sx={{ 
                                    backgroundColor: 'background.paper',
                                    boxShadow: 1,
                                    width: 48,
                                    height: 48,
                                    flexShrink: 0,
                                    '&:hover': { 
                                        backgroundColor: 'action.hover',
                                        boxShadow: 2,
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            >
                                <FilterListIcon />
                            </IconButton>
                            <Autocomplete
                                freeSolo
                                options={filteredRecipes}
                                getOptionLabel={(option) => option.title}
                                onChange={(event, newValue) => handleSearch(newValue)}
                                sx={{ flexGrow: 1 }}
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
                                                height: '48px',
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

            <RecipeList recipes={filteredRecipes.length > 0 ? filteredRecipes : recipes} />

            <AIChatBot />

            {/* Filtreleme Modalı */}
            <Dialog 
                open={filterOpen} 
                onClose={() => setFilterOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    py: 3,
                    px: 4,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    Tarif Filtreleme
                </DialogTitle>
                <DialogContent sx={{ 
                    p: 4,
                    bgcolor: 'background.default'
                }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 2
                                }}>
                                    Süre (dakika)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            duration: [Math.max(0, prev.duration[0] - 5), prev.duration[1]]
                                        }))}
                                        size="small"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            duration: [prev.duration[0] + 5, prev.duration[1]]
                                        }))}
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <Slider
                                        value={filters.duration}
                                        onChange={handleRangeChange('duration')}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={180}
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            duration: [prev.duration[0], Math.max(prev.duration[1] - 5, prev.duration[0])]
                                        }))}
                                        size="small"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            duration: [prev.duration[0], Math.min(180, prev.duration[1] + 5)]
                                        }))}
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                    {filters.duration[0]} - {filters.duration[1]} dakika
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 2
                                }}>
                                    Zorluk Seviyesi
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={filters.difficulty}
                                        onChange={handleFilterChange('difficulty')}
                                        sx={{ 
                                            borderRadius: 2,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main'
                                            }
                                        }}
                                    >
                                        <MenuItem value="">Tümü</MenuItem>
                                        <MenuItem value="Kolay">Kolay</MenuItem>
                                        <MenuItem value="Orta">Orta</MenuItem>
                                        <MenuItem value="Zor">Zor</MenuItem>
                                    </Select>
                                </FormControl>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 2
                                }}>
                                    Kalori
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            calories: [Math.max(0, prev.calories[0] - 50), prev.calories[1]]
                                        }))}
                                        size="small"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            calories: [prev.calories[0] + 50, prev.calories[1]]
                                        }))}
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <Slider
                                        value={filters.calories}
                                        onChange={handleRangeChange('calories')}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={1000}
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            calories: [prev.calories[0], Math.max(prev.calories[1] - 50, prev.calories[0])]
                                        }))}
                                        size="small"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            calories: [prev.calories[0], Math.min(1000, prev.calories[1] + 50)]
                                        }))}
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                    {filters.calories[0]} - {filters.calories[1]} kalori
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 2
                                }}>
                                    Porsiyon Sayısı
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            servings: [Math.max(1, prev.servings[0] - 1), prev.servings[1]]
                                        }))}
                                        size="small"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            servings: [prev.servings[0] + 1, prev.servings[1]]
                                        }))}
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <Slider
                                        value={filters.servings}
                                        onChange={handleRangeChange('servings')}
                                        valueLabelDisplay="auto"
                                        min={1}
                                        max={10}
                                        step={1}
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            servings: [prev.servings[0], Math.max(prev.servings[1] - 1, prev.servings[0])]
                                        }))}
                                        size="small"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => setFilters(prev => ({
                                            ...prev,
                                            servings: [prev.servings[0], Math.min(10, prev.servings[1] + 1)]
                                        }))}
                                        size="small"
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                    {filters.servings[0]} - {filters.servings[1]} porsiyon
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <Typography variant="h6" gutterBottom sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                    mb: 2
                                }}>
                                    Yemek Tipi
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={filters.type}
                                        onChange={handleFilterChange('type')}
                                        sx={{ 
                                            borderRadius: 2,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main'
                                            }
                                        }}
                                    >
                                        <MenuItem value="">Tümü</MenuItem>
                                        <MenuItem value="Ana Yemek">Ana Yemek</MenuItem>
                                        <MenuItem value="Çorba">Çorba</MenuItem>
                                        <MenuItem value="Salata">Salata</MenuItem>
                                        <MenuItem value="Tatlı">Tatlı</MenuItem>
                                        <MenuItem value="Kahvaltı">Kahvaltı</MenuItem>
                                        <MenuItem value="Aperatif">Aperatif</MenuItem>
                                        <MenuItem value="Vejetaryen">Vejetaryen</MenuItem>
                                        <MenuItem value="Vegan">Vegan</MenuItem>
                                    </Select>
                                </FormControl>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ 
                    p: 3, 
                    bgcolor: 'grey.50',
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button 
                        onClick={handleFilterReset}
                        variant="outlined"
                        color="primary"
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'white'
                            }
                        }}
                    >
                        Sıfırla
                    </Button>
                    <Button 
                        onClick={() => setFilterOpen(false)}
                        variant="outlined"
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            '&:hover': {
                                bgcolor: 'grey.200'
                            }
                        }}
                    >
                        İptal
                    </Button>
                    <Button 
                        onClick={handleFilterApply} 
                        variant="contained" 
                        color="primary"
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            '&:hover': {
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                            }
                        }}
                    >
                        Uygula
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default HomePage; 