import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'raffaele.santone@metodi.pro' && password === 'MinervaStudio') {
      onLogin(true);
      localStorage.setItem('minerva_authenticated', 'true');
    } else {
      setError('Credenziali non valide. Riprova.');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      px: 2 // Padding orizzontale per mobile
    }}>
      <Paper elevation={4} sx={{ 
        p: { xs: 3, sm: 4 }, 
        width: '100%', 
        maxWidth: 400, 
        borderTop: '4px solid', 
        borderColor: 'primary.main',
        borderRadius: 2
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box 
            component="img" 
            src="/logo.png" 
            alt="Minerva Studio Logo" 
            sx={{ 
              width: '80%', 
              maxWidth: 200, 
              mb: 3,
              mt: 2 
            }} 
          />
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
            Piattaforma di gestione e organizzazione di idee e progetti
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="email"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ py: 1.5, mb: 2 }}
          onClick={handleLogin}
        >
          ACCEDI
        </Button>
        
        <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 4, mb: 1 }}>
          CREATED BY METODI.PRO
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;