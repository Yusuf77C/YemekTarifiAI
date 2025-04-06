import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Alert
} from '@mui/material';

const RegisterForm = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        try {
            console.log('Kayıt denemesi:', formData); // Debug log
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            console.log('Sunucu yanıtı:', response); // Debug log

            const data = await response.json();
            console.log('Yanıt verisi:', data); // Debug log

            if (!response.ok) {
                throw new Error(data.message || 'Kayıt yapılamadı');
            }

            // Başarılı kayıt sonrası onRegister fonksiyonunu çağır
            if (onRegister) {
                onRegister(data);
            }
            
            setError('');
        } catch (err) {
            console.error('Register error:', err); // Debug log
            if (err.message) {
                setError(err.message);
            } else {
                setError('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
            }
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Kayıt Ol
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Kullanıcı Adı"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="E-posta"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Şifre"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Şifre Tekrar"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3 }}
                >
                    Kayıt Ol
                </Button>
            </Box>
        </Paper>
    );
};

export default RegisterForm; 