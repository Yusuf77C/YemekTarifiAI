import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box,
    Modal,
    Tab,
    Tabs
} from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Header = ({ user, onLogout, onLogin, onRegister }) => {
    const [open, setOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleLoginSuccess = (userData) => {
        onLogin(userData);
        handleClose();
    };

    const handleRegisterSuccess = (userData) => {
        onRegister(userData);
        handleClose();
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Yemek Tarifi
                    </Typography>
                    <Box>
                        {user ? (
                            <>
                                <Typography component="span" sx={{ mr: 2 }}>
                                    Hoş geldin, {user.username}
                                </Typography>
                                <Button color="inherit" onClick={onLogout}>
                                    Çıkış Yap
                                </Button>
                            </>
                        ) : (
                            <Button color="inherit" onClick={handleOpen}>
                                Giriş Yap / Kayıt Ol
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="auth-modal-title"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 1
                }}>
                    <Tabs value={tabValue} onChange={handleTabChange} centered>
                        <Tab label="Giriş Yap" />
                        <Tab label="Kayıt Ol" />
                    </Tabs>
                    <Box sx={{ mt: 2 }}>
                        {tabValue === 0 ? (
                            <LoginForm onLogin={handleLoginSuccess} />
                        ) : (
                            <RegisterForm onRegister={handleRegisterSuccess} />
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Header; 