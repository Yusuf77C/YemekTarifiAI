import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = ({ onRegister }) => {
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
                    Kayıt Ol
                </Typography>
                <RegisterForm onRegister={onRegister} />
            </Box>
        </Container>
    );
};

export default RegisterPage; 