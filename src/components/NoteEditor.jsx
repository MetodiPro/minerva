import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, IconButton, FormControl, InputLabel, Select, MenuItem, Chip, FormHelperText } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import FolderIcon from '@mui/icons-material/Folder';

const NoteEditor = ({ onSave, initialNote, projects }) => {
  const [title, setTitle] = useState(initialNote ? initialNote.title : '');
  const [content, setContent] = useState(initialNote ? initialNote.content : '');
  const [version, setVersion] = useState(initialNote ? (initialNote.version || 1) : 1);
  const [projectId, setProjectId] = useState(initialNote ? (initialNote.projectId || '') : '');
  const [projectIdError, setProjectIdError] = useState(false);
  
  // Aggiorna i campi quando cambia la nota iniziale
  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setVersion(initialNote.version || 1);
      setProjectId(initialNote.projectId || '');
      setProjectIdError(false);
    }
  }, [initialNote]);

  const handleSave = () => {
    if (!projectId) {
      setProjectIdError(true);
      return;
    }
    
    if (title.trim() && content.trim()) {
      const currentDate = new Date();
      const noteData = {
        title, 
        content, 
        projectId,
        timestamp: currentDate.toISOString(),
        version: initialNote ? version + 1 : 1,
        versionHistory: initialNote && initialNote.versionHistory 
          ? [...initialNote.versionHistory, {
              version: version + 1,
              timestamp: currentDate.toISOString(),
              changes: `Aggiornamento: ${currentDate.toLocaleString('it-IT')}`
            }]
          : [{
              version: 1,
              timestamp: currentDate.toISOString(),
              changes: `Creazione: ${currentDate.toLocaleString('it-IT')}`
            }]
      };
      
      onSave(noteData);
      if (!initialNote) {
        // Pulisci i campi solo se stai creando una nuova nota
        setTitle('');
        setContent('');
        setProjectId('');
      }
    }
  };
  
  const handleCancel = () => {
    // Resetta i campi e cancella la nota in modifica
    setTitle('');
    setContent('');
    setProjectId('');
    setProjectIdError(false);
    // Notifica il componente padre che l'editing è stato annullato
    if (initialNote) {
      onSave(null);
    }
  };

  return (
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">
          {initialNote ? 'Modifica Annotazione' : 'Crea Nuova Annotazione'}
        </Typography>
        {initialNote && (
          <Typography variant="caption" color="text.secondary">
            In modifica dal: {new Date(initialNote.timestamp).toLocaleString('it-IT')}
          </Typography>
        )}
      </Box>
      
      <TextField
        label="Titolo"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Contenuto"
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        margin="normal"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <FormControl fullWidth margin="normal" sx={{ mb: 2 }} error={projectIdError}>
        <InputLabel id="project-select-label">Progetto *</InputLabel>
        <Select
          labelId="project-select-label"
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value);
            setProjectIdError(false);
          }}
          label="Progetto *"
          required
          startAdornment={<FolderIcon sx={{ mr: 1, ml: -0.5 }} />}
        >
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="">
              Nessun progetto disponibile
            </MenuItem>
          )}
        </Select>
        {projectIdError && (
          <FormHelperText>È obbligatorio selezionare un progetto</FormHelperText>
        )}
      </FormControl>
      
      {initialNote && initialNote.version && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Versione: v{initialNote.version}
            </Typography>
          </Box>
          <Typography variant="caption" display="block" color="text.secondary">
            Ultima modifica: {new Date(initialNote.timestamp).toLocaleString('it-IT')}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {(initialNote || title.trim() || content.trim()) && (
          <Button 
            variant="outlined" 
            color="secondary" 
            startIcon={<ClearIcon />}
            onClick={handleCancel}
          >
            {initialNote ? 'Annulla Modifica' : 'Cancella'}
          </Button>
        )}
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!title.trim() || !content.trim()}
        >
          {initialNote ? 'Aggiorna' : 'Salva'}
        </Button>
      </Box>
    </Paper>
  );
};

export default NoteEditor;