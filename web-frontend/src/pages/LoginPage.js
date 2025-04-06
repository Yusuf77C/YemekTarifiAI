import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ onLogin }) => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    align="center" 
                    gutterBottom
                    sx={{ 
                        color: '#E65100',
                        fontWeight: 'bold'
                    }}
                >
                    Giriş Yap
                </Typography>
                <LoginForm onLogin={onLogin} />
            </Box>
        </Container>
    );
};

export default LoginPage; 