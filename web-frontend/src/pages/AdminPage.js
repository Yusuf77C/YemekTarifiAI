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
        calories: '',
        category: '',
        image: ''
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Hata mesajını temizle
        if (error) setError('');
    };

    // Form doğrulama
    const validateForm = () => {
        const errors = [];
        
        if (!formData.title.trim()) errors.push('Tarif başlığı zorunludur');
        if (!formData.description.trim()) errors.push('Tarif açıklaması zorunludur');
        if (!formData.ingredients.trim()) errors.push('En az bir malzeme eklenmelidir');
        if (!formData.instructions.trim()) errors.push('En az bir adım eklenmelidir');
        if (!formData.cookingTime || formData.cookingTime < 1) errors.push('Geçerli bir pişirme süresi giriniz');
        if (!formData.difficulty) errors.push('Zorluk seviyesi seçiniz');
        if (!formData.servings || formData.servings < 1) errors.push('Geçerli bir porsiyon sayısı giriniz');
        if (!formData.calories || formData.calories < 0) errors.push('Geçerli bir kalori değeri giriniz');
        if (!formData.category) errors.push('Kategori seçiniz');

        return errors;
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
            calories: '',
            category: '',
            image: ''
        });
        setOpen(true);
    };

    // Modalı kapat
    const handleClose = () => {
        setOpen(false);
        setError('');
        setSuccess('');
    };

    const refreshToken = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token bulunamadı');
            }

            const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Token yenilenemedi');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.token;
        } catch (error) {
            console.error('Token yenileme hatası:', error);
            throw error;
        }
    };

    // Tarif ekleme/güncelleme
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Form doğrulama
        const errors = validateForm();
        if (errors.length > 0) {
            setError(errors.join('\n'));
            return;
        }

        try {
            let token = localStorage.getItem('token');
            if (!token) {
                setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }

            // Malzemeleri ve talimatları diziye çevir
            const ingredientsArray = formData.ingredients.split('\n').filter(item => item.trim());
            const instructionsArray = formData.instructions.split('\n').filter(item => item.trim());

            const url = editingRecipe
                ? `http://localhost:5000/api/recipes/${editingRecipe._id}`
                : 'http://localhost:5000/api/recipes';
            
            const method = editingRecipe ? 'PUT' : 'POST';

            // Zorunlu alanları kontrol et
            const requiredFields = ['title', 'description', 'ingredients', 'instructions', 'cookingTime', 'difficulty', 'servings', 'calories', 'category'];
            const missingFields = [];
            
            for (const field of requiredFields) {
                if (!formData[field]) {
                    missingFields.push(field);
                }
            }

            if (missingFields.length > 0) {
                setError(`Aşağıdaki alanlar zorunludur: ${missingFields.join(', ')}`);
                return;
            }

            const requestData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                ingredients: ingredientsArray,
                instructions: instructionsArray,
                cookingTime: parseInt(formData.cookingTime),
                difficulty: formData.difficulty,
                servings: parseInt(formData.servings),
                calories: parseInt(formData.calories),
                category: formData.category,
                image: formData.image.trim() || 'https://source.unsplash.com/random/800x600/?food'
            };

            console.log('Gönderilen veri:', requestData);

            let response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            // Token geçersizse yenilemeyi dene
            if (response.status === 401) {
                try {
                    token = await refreshToken();
                    response = await fetch(url, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(requestData)
                    });
                } catch (refreshError) {
                    console.error('Token yenileme hatası:', refreshError);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                    return;
                }
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Sunucu hatası:', errorData);
                if (errorData.missingFields) {
                    throw new Error(`Eksik alanlar: ${errorData.missingFields.join(', ')}`);
                }
                throw new Error(errorData.message || 'Tarif kaydedilemedi');
            }

            const data = await response.json();
            console.log('Başarılı yanıt:', data);
            setSuccess(editingRecipe ? 'Tarif başarıyla güncellendi' : 'Tarif başarıyla eklendi');
            handleClose();
            fetchRecipes(); // Tarifleri yeniden yükle
        } catch (err) {
            console.error('Tarif kaydetme hatası:', err);
            setError(err.message || 'Bir hata oluştu');
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
                                label="Kalori"
                                name="calories"
                                type="number"
                                value={formData.calories}
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
                                label="Görsel URL"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
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