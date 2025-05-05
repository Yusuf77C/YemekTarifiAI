import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import axios from 'axios';

const FavoriteButton = ({ recipeId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        checkIfFavorite();
    }, [recipeId]);

    const checkIfFavorite = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsFavorite(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/api/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const favorites = response.data;
            setIsFavorite(favorites.some(fav => fav._id === recipeId));
        } catch (error) {
            console.error('Favori kontrolü hatası:', error);
            setIsFavorite(false);
            if (error.response?.status === 401) {
                setSnackbar({
                    open: true,
                    message: 'Lütfen giriş yapın',
                    severity: 'warning'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.message || 'Favori durumu kontrol edilirken bir hata oluştu',
                    severity: 'error'
                });
            }
        }
    };

    const handleFavorite = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setSnackbar({
                    open: true,
                    message: 'Lütfen giriş yapın',
                    severity: 'warning'
                });
                return;
            }

            if (isFavorite) {
                await axios.delete(`http://localhost:5000/api/favorites/${recipeId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSnackbar({
                    open: true,
                    message: 'Tarif favorilerden kaldırıldı',
                    severity: 'success'
                });
            } else {
                await axios.post(`http://localhost:5000/api/favorites/${recipeId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSnackbar({
                    open: true,
                    message: 'Tarif favorilere eklendi',
                    severity: 'success'
                });
            }

            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Favori işlemi hatası:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Bir hata oluştu',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            <Tooltip title={isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}>
                <IconButton 
                    onClick={handleFavorite} 
                    disabled={loading}
                    color={isFavorite ? "error" : "default"}
                    sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            </Tooltip>
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={3000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default FavoriteButton; 