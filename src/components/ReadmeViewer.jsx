import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const ReadmeViewer = ({ notes }) => {
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
          Nessun contenuto disponibile. Crea delle annotazioni per generare il documento.
        </Typography>
      </Paper>
    );
  }

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
      <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        Documento README Generato
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {notes.map((note, index) => (
        <Box key={note.timestamp} sx={{ mb: 3 }}>
          <Typography variant="h6" color="secondary" sx={{ fontWeight: 'bold' }}>
            {index + 1}. {note.title}
          </Typography>
          
          <Typography variant="body1" color="text.primary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
            {note.content}
          </Typography>
          
          {index < notes.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
    </Paper>
  );
};

export default ReadmeViewer;