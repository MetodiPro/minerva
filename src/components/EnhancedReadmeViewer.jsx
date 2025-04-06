import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FolderIcon from '@mui/icons-material/Folder';
import { generateReadmeFromProject, isConfigured } from '../services/openaiService';

const EnhancedReadmeViewer = ({ notes, projects }) => {
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  // Controlla se l'API è configurata
  useEffect(() => {
    setApiConfigured(isConfigured());
  }, []);
  
  // Genera il README utilizzando ChatGPT
  const handleGenerateReadme = async () => {
    if (!selectedProjectId || !notes || notes.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const selectedProject = projects.find(p => p.id === selectedProjectId);
      if (!selectedProject) {
        throw new Error('Progetto selezionato non trovato');
      }
      
      const content = await generateReadmeFromProject(selectedProject, notes);
      setGeneratedContent(content);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Visualizzazione quando non ci sono progetti o note
  if (!projects || projects.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderLeft: '4px solid', 
          borderColor: 'primary.main',
          backgroundColor: 'background.paper',
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Nessun progetto disponibile. Crea dei progetti per generare il documento README.
        </Typography>
      </Paper>
    );
  }
  
  if (!notes || notes.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderLeft: '4px solid', 
          borderColor: 'primary.main',
          backgroundColor: 'background.paper',
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Nessuna nota disponibile. Crea delle annotazioni per generare il documento.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <>
      {/* Selettore di progetto e pulsante per generare README */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="project-select-readme-label">Seleziona Progetto</InputLabel>
          <Select
            labelId="project-select-readme-label"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            label="Seleziona Progetto"
            startAdornment={<FolderIcon sx={{ mr: 1, ml: -0.5 }} />}
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          color="success"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
          onClick={handleGenerateReadme}
          disabled={isLoading || !apiConfigured || notes.length === 0 || !selectedProjectId}
        >
          {isLoading ? 'Generazione in corso...' : 'Genera README con ChatGPT'}
        </Button>
      </Box>
      
      {/* Messaggio di errore */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Contenuto generato da ChatGPT */}
      {generatedContent && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderLeft: '4px solid', 
            borderColor: 'success.main',
            backgroundColor: 'background.paper'
          }}
        >
          <Typography variant="h5" gutterBottom color="success.main" sx={{ fontWeight: 'bold' }}>
            README Generato da ChatGPT
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
            {generatedContent}
          </Typography>
        </Paper>
      )}
      
      {/* Visualizzazione predefinita delle note del progetto selezionato */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderLeft: '4px solid', 
          borderColor: 'primary.main',
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          {selectedProjectId 
            ? `Documento README per: ${projects.find(p => p.id === selectedProjectId)?.name || 'Progetto selezionato'}`
            : 'Seleziona un progetto per visualizzare il README'}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {selectedProjectId ? (
          // Filtra le note per il progetto selezionato
          notes.filter(note => note.projectId === selectedProjectId).length > 0 ? (
            notes.filter(note => note.projectId === selectedProjectId).map((note, index) => (
              <Box key={note.timestamp} sx={{ mb: 3 }}>
                <Typography variant="h6" color="secondary" sx={{ fontWeight: 'bold' }}>
                  {index + 1}. {note.title}
                </Typography>
                
                <Typography variant="body1" color="text.primary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </Typography>
                
                {index < notes.filter(note => note.projectId === selectedProjectId).length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Nessuna nota associata a questo progetto. Aggiungi delle note a questo progetto per generare un README.
            </Typography>
          )
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Seleziona un progetto per visualizzare le relative note e generare un README.
          </Typography>
        )}
      </Paper>
    </>
  );
};

export default EnhancedReadmeViewer;