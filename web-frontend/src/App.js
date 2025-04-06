import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import RecipeDetail from './components/RecipeDetail';

// Korumalı rota bileşeni
const ProtectedRoute = ({ children, isAdmin }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (isAdmin && userRole !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

const App = () => {
    const [user, setUser] = useState(null);

    const theme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#dc004e',
            },
        },
    });

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userRole', userData.role);
    };

    const handleRegister = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userRole', userData.role);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route 
                        path="/login" 
                        element={
                            user ? 
                            <Navigate to="/" /> : 
                            <LoginPage onLogin={handleLogin} />
                        } 
                    />
                    <Route 
                        path="/register" 
                        element={
                            user ? 
                            <Navigate to="/" /> : 
                            <RegisterPage onRegister={handleRegister} />
                        } 
                    />
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute isAdmin={true}>
                                <AdminPage />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
