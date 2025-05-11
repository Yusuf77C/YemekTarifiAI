import React, { useState } from 'react';
import { 
  Box, 
  Fab, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import { 
  Restaurant as RestaurantIcon,
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage = { type: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');

    try {
      // Gemini AI API çağrısı
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      // AI yanıtını ekle
      const aiMessage = { type: 'ai', content: data.response };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI yanıtı alınamadı:', error);
      const errorMessage = { 
        type: 'ai', 
        content: 'Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.' 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="AI Chat"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#FF9800',
          '&:hover': {
            backgroundColor: '#F57C00',
          },
        }}
      >
        <RestaurantIcon />
      </Fab>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '600px',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#FF9800',
          color: 'white'
        }}>
          <Typography variant="h6">Yemek Asistanı</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          p: 2,
          gap: 2
        }}>
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {chatHistory.map((msg, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.type === 'user' ? '#FFF3E0' : '#F5F5F5',
                  borderRadius: 2
                }}
              >
                <Typography>{msg.content}</Typography>
              </Paper>
            ))}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            mt: 'auto'
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Mesajınızı yazın..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              size="small"
            />
            <IconButton 
              color="primary" 
              onClick={handleSend}
              sx={{ 
                backgroundColor: '#FF9800',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#F57C00',
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChatBot; 