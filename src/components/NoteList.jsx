import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, Divider, IconButton, Chip, Tabs, Tab, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import FolderIcon from '@mui/icons-material/Folder';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const NoteList = ({ notes, projects, onDelete, onEdit }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Filtra le note in base alla tab selezionata
  const filteredNotes = notes;
  
  // Gestisce l'apertura del dialog della cronologia
  const handleOpenHistoryDialog = (note) => {
    setSelectedNote(note);
    setHistoryDialogOpen(true);
  };
  
  // Chiude il dialog della cronologia
  const handleCloseHistoryDialog = () => {
    setHistoryDialogOpen(false);
    setSelectedNote(null);
  };
  if (!notes || notes.length === 0) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderLeft: '4px solid', 
          borderColor: 'secondary.main',
          backgroundColor: 'background.paper',
          textAlign: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Non hai ancora creato annotazioni. Usa l'editor sopra per iniziare.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      {/* Tabs per filtrare le note */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab label="Tutte le Note" />
        </Tabs>
      </Paper>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderLeft: '4px solid', 
          borderColor: 'secondary.main',
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="h6" gutterBottom color="secondary">
          Tutte le Annotazioni
        </Typography>
      
      {filteredNotes.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          {notes.length === 0 
            ? 'Non hai ancora creato annotazioni. Usa l\'editor sopra per iniziare.'
            : 'Nessuna nota in questa categoria.'}
        </Typography>
      ) : (
        <List sx={{ width: '100%' }}>
          {filteredNotes.map((note, index) => (
          <React.Fragment key={note.timestamp}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Box>
                  {note.versionHistory && note.versionHistory.length > 0 && (
                    <Tooltip title="Cronologia versioni">
                      <IconButton 
                        edge="end" 
                        aria-label="history" 
                        onClick={() => handleOpenHistoryDialog(note)} 
                        color="info"
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Modifica nota">
                    <IconButton edge="end" aria-label="edit" onClick={() => onEdit(note)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Elimina nota">
                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(note)} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              sx={{ py: 2 }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" color="primary" fontWeight="bold">
                    {note.title}
                  </Typography>
                  {note.projectId && (
                    <Chip
                      size="small"
                      icon={<FolderIcon />}
                      label={projects.find(p => p.id === note.projectId)?.name || 'Progetto non trovato'}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {note.version && (
                    <Chip 
                      size="small" 
                      label={`v${note.version}`} 
                      color="default"
                      variant="outlined"
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {new Date(note.timestamp).toLocaleString('it-IT')}
                </Typography>
              </Box>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
      )}
    </Paper>
    
    {/* Dialog per visualizzare la cronologia delle versioni */}
    <Dialog open={historyDialogOpen} onClose={handleCloseHistoryDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        Cronologia Versioni: {selectedNote?.title}
      </DialogTitle>
      <DialogContent>
        {selectedNote?.versionHistory && selectedNote.versionHistory.length > 0 ? (
          <List>
            {selectedNote.versionHistory.map((version, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <ListItem>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" color="primary">
                      Versione {version.version}
                    </Typography>
                    <Typography variant="body2">
                      {version.changes}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(version.timestamp).toLocaleString('it-IT')}
                    </Typography>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Nessuna cronologia disponibile per questa nota.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseHistoryDialog} color="primary">
          Chiudi
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default NoteList;