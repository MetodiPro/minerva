import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, Collapse, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { getApiKey, saveApiKey, isConfigured } from '../services/openaiService';

const ApiKeyConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [isConfiguredState, setIsConfiguredState] = useState(false);
  const [rememberKey, setRememberKey] = useState(true);
  
  useEffect(() => {
    // Controlla se la chiave API è già configurata
    const key = getApiKey();
    setIsConfiguredState(!!key);
    if (key) {
      // Maschera la chiave API per motivi di sicurezza
      setApiKey('••••••••••••••••••••••••••••••');
    }
  }, []);
  
  const handleSave = () => {
    if (apiKey.trim()) {
      // Salva solo se non è la versione mascherata
      if (!apiKey.includes('•')) {
        // Salva la chiave API nel localStorage in modo permanente o solo per la sessione corrente
        saveApiKey(apiKey.trim(), rememberKey);
      }
      
      setIsConfiguredState(true);
      setAlertSeverity('success');
      setAlertMessage(rememberKey ? 'Chiave API salvata permanentemente!' : 'Chiave API salvata per questa sessione');
      setShowAlert(true);
    } else {
      setAlertSeverity('error');
      setAlertMessage('Inserisci una chiave API valida');
      setShowAlert(true);
    }
  };
  
  const handleChange = (e) => {
    setApiKey(e.target.value);
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderLeft: '4px solid', 
        borderColor: 'info.main',
        backgroundColor: 'background.paper'
      }}
    >
      <Typography variant="h6" color="info.main" gutterBottom>
        Configurazione API OpenAI
      </Typography>
      
      <Collapse in={showAlert}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowAlert(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Per utilizzare la funzionalità di generazione README con ChatGPT, è necessario configurare una chiave API di OpenAI.
        {isConfiguredState && (
          <Typography component="span" fontWeight="bold" color="success.main"> (Configurata)</Typography>
        )}
      </Typography>
      
      <TextField
        label="Chiave API OpenAI"
        variant="outlined"
        fullWidth
        margin="normal"
        value={apiKey}
        onChange={handleChange}
        type="password"
        placeholder="sk-..."
        sx={{ mb: 1 }}
      />
      
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberKey}
            onChange={(e) => setRememberKey(e.target.checked)}
            color="info"
          />
        }
        label="Ricorda la chiave API per utilizzi futuri"
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="info" 
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!apiKey.trim()}
        >
          Salva Chiave API
        </Button>
      </Box>
    </Paper>
  );
};

export default ApiKeyConfig;