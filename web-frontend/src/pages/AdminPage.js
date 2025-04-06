import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Grid,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const AdminPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        cookingTime: '',
        difficulty: '',
        servings: '',
        image: '',
        category: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Tarifleri getir
    const fetchRecipes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recipes');
            const data = await response.json();
            setRecipes(data);
        } catch (err) {
            setError('Tarifler yüklenirken bir hata oluştu');
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    // Form verilerini güncelle
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Yeni tarif ekleme modalını aç
    const handleOpen = () => {
        setEditingRecipe(null);
        setFormData({
            title: '',
            description: '',
            ingredients: '',
            instructions: '',
            cookingTime: '',
            difficulty: '',
            servings: '',
            image: '',
            category: ''
        });
        setOpen(true);
    };

    // Modalı kapat
    const handleClose = () => {
        setOpen(false);
        setError('');
        setSuccess('');
    };

    // Tarif ekleme/güncelleme
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingRecipe
                ? `http://localhost:5000/api/recipes/${editingRecipe._id}`
                : 'http://localhost:5000/api/recipes';
            
            const method = editingRecipe ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...formData,
                    ingredients: formData.ingredients.split('\n'),
                    instructions: formData.instructions.split('\n')
                })
            });

            if (!response.ok) {
                throw new Error('Tarif kaydedilemedi');
            }

            setSuccess(editingRecipe ? 'Tarif güncellendi' : 'Tarif eklendi');
            handleClose();
            fetchRecipes();
        } catch (err) {
            setError(err.message);
        }
    };

    // Tarif silme
    const handleDelete = async (id) => {
        if (window.confirm('Bu tarifi silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Tarif silinemedi');
                }

                setSuccess('Tarif silindi');
                fetchRecipes();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // Tarif düzenleme
    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setFormData({
            ...recipe,
            ingredients: recipe.ingredients.join('\n'),
            instructions: recipe.instructions.join('\n')
        });
        setOpen(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Admin Paneli</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Yeni Tarif Ekle
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Başlık</TableCell>
                            <TableCell>Kategori</TableCell>
                            <TableCell>Pişirme Süresi</TableCell>
                            <TableCell>Zorluk</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recipes.map((recipe) => (
                            <TableRow key={recipe._id}>
                                <TableCell>{recipe.title}</TableCell>
                                <TableCell>{recipe.category}</TableCell>
                                <TableCell>{recipe.cookingTime} dk</TableCell>
                                <TableCell>{recipe.difficulty}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(recipe)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(recipe._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingRecipe ? 'Tarif Düzenle' : 'Yeni Tarif Ekle'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Başlık"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Açıklama"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Malzemeler (Her satıra bir malzeme)"
                                name="ingredients"
                                value={formData.ingredients}
                                onChange={handleChange}
                                multiline
                                rows={5}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Hazırlanışı (Her satıra bir adım)"
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleChange}
                                multiline
                                rows={5}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Pişirme Süresi (dk)"
                                name="cookingTime"
                                type="number"
                                value={formData.cookingTime}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Zorluk"
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Porsiyon"
                                name="servings"
                                type="number"
                                value={formData.servings}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Kategori"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Resim URL"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>İptal</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingRecipe ? 'Güncelle' : 'Ekle'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPage; 