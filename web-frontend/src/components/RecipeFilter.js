import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Typography,
    Box,
    TextField,
    Grid
} from '@mui/material';

const RecipeFilter = ({ open, onClose, onFilter }) => {
    const [filters, setFilters] = useState({
        duration: [0, 180],
        difficulty: '',
        calories: [0, 1000],
        servings: [1, 10],
        type: '',
        search: ''
    });

    const handleChange = (name) => (event) => {
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

    const handleApply = () => {
        const queryParams = new URLSearchParams();
        
        if (filters.duration[0] > 0 || filters.duration[1] < 180) {
            queryParams.append('duration', `${filters.duration[0]}-${filters.duration[1]}`);
        }
        
        if (filters.difficulty) {
            queryParams.append('difficulty', filters.difficulty);
        }
        
        if (filters.calories[0] > 0 || filters.calories[1] < 1000) {
            queryParams.append('calories', `${filters.calories[0]}-${filters.calories[1]}`);
        }
        
        if (filters.servings[0] > 1 || filters.servings[1] < 10) {
            queryParams.append('servings', `${filters.servings[0]}-${filters.servings[1]}`);
        }
        
        if (filters.type) {
            queryParams.append('type', filters.type);
        }
        
        if (filters.search) {
            queryParams.append('search', filters.search);
        }

        onFilter(queryParams.toString());
        onClose();
    };

    const handleReset = () => {
        setFilters({
            duration: [0, 180],
            difficulty: '',
            calories: [0, 1000],
            servings: [1, 10],
            type: '',
            search: ''
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Tarif Filtreleme</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Arama"
                            value={filters.search}
                            onChange={handleChange('search')}
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography gutterBottom>Süre (dakika)</Typography>
                        <Slider
                            value={filters.duration}
                            onChange={handleRangeChange('duration')}
                            valueLabelDisplay="auto"
                            min={0}
                            max={180}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Zorluk Seviyesi</InputLabel>
                            <Select
                                value={filters.difficulty}
                                onChange={handleChange('difficulty')}
                                label="Zorluk Seviyesi"
                            >
                                <MenuItem value="">Tümü</MenuItem>
                                <MenuItem value="kolay">Kolay</MenuItem>
                                <MenuItem value="orta">Orta</MenuItem>
                                <MenuItem value="zor">Zor</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography gutterBottom>Kalori</Typography>
                        <Slider
                            value={filters.calories}
                            onChange={handleRangeChange('calories')}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography gutterBottom>Porsiyon Sayısı</Typography>
                        <Slider
                            value={filters.servings}
                            onChange={handleRangeChange('servings')}
                            valueLabelDisplay="auto"
                            min={1}
                            max={10}
                            step={1}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Yemek Tipi</InputLabel>
                            <Select
                                value={filters.type}
                                onChange={handleChange('type')}
                                label="Yemek Tipi"
                            >
                                <MenuItem value="">Tümü</MenuItem>
                                <MenuItem value="ana-yemek">Ana Yemek</MenuItem>
                                <MenuItem value="corba">Çorba</MenuItem>
                                <MenuItem value="salata">Salata</MenuItem>
                                <MenuItem value="tatli">Tatlı</MenuItem>
                                <MenuItem value="kahvalti">Kahvaltı</MenuItem>
                                <MenuItem value="aperatif">Aperatif</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleReset}>Sıfırla</Button>
                <Button onClick={onClose}>İptal</Button>
                <Button onClick={handleApply} variant="contained" color="primary">
                    Uygula
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecipeFilter; 