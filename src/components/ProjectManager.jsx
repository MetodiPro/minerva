import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Tabs, Tab, Chip, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const ProjectManager = ({ projects, onSaveProject, onDeleteProject }) => {
  const [editingProject, setEditingProject] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState('nuovo');
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectVersions, setProjectVersions] = useState([]);
  
  const handleOpenDialog = (project = null) => {
    if (project) {
      setProjectName(project.name);
      setProjectDescription(project.description);
      setEditingProject(project);
    } else {
      setProjectName('');
      setProjectDescription('');
      setEditingProject(null);
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProjectName('');
    setProjectDescription('');
    setEditingProject(null);
  };
  
  const handleSaveProject = () => {
    if (projectName.trim()) {
      // Crea una nuova versione del progetto
      const currentDate = new Date();
      const newId = editingProject ? editingProject.id : Date.now().toString();
      console.log('Creazione progetto con ID:', newId); // Log per debug
      
      const projectData = {
        name: projectName.trim(),
        description: projectDescription.trim(),
        status: projectStatus,
        timestamp: currentDate.toISOString(),
        id: newId,
        version: editingProject ? (editingProject.version || 0) + 1 : 1,
        versionHistory: editingProject && editingProject.versionHistory 
          ? [...editingProject.versionHistory, {
              version: (editingProject.version || 0) + 1,
              timestamp: currentDate.toISOString(),
              changes: `Aggiornamento: ${currentDate.toLocaleString('it-IT')}`
            }]
          : [{
              version: 1,
              timestamp: currentDate.toISOString(),
              changes: `Creazione: ${currentDate.toLocaleString('it-IT')}`
            }]
      };
      
      onSaveProject(projectData);
      handleCloseDialog();
    }
  };
  
  // Filtra i progetti in base alla tab selezionata
  const filteredProjects = projects.filter(project => {
    if (currentTab === 0) return true; // Tutti i progetti
    if (currentTab === 1) return project.status === 'in_corso'; // Progetti in corso
    if (currentTab === 2) return project.status === 'nuovo'; // Nuovi progetti
    return true;
  });
  
  // Gestisce l'apertura del dialog della cronologia
  const handleOpenHistoryDialog = (project) => {
    setSelectedProject(project);
    setProjectVersions(project.versionHistory || []);
    setHistoryDialogOpen(true);
  };
  
  // Chiude il dialog della cronologia
  const handleCloseHistoryDialog = () => {
    setHistoryDialogOpen(false);
    setSelectedProject(null);
    setProjectVersions([]);
  };
  
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
          Gestione Progetti
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuovo Progetto
        </Button>
      </Box>
      
      {/* Tabs per filtrare i progetti */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Tutti i Progetti" />
          <Tab 
            label="Progetti in Corso" 
            icon={<FolderOpenIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Nuovi Progetti" 
            icon={<FolderSpecialIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      
      {/* Lista Progetti */}
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
          {currentTab === 0 ? 'Tutti i Progetti' : 
           currentTab === 1 ? 'Progetti in Corso' : 'Nuovi Progetti'}
        </Typography>
        
        {filteredProjects.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            {projects.length === 0 
              ? 'Non hai ancora creato progetti. Usa il pulsante "Nuovo Progetto" per iniziare.'
              : 'Nessun progetto in questa categoria.'}
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {filteredProjects.map((project, index) => (
              <React.Fragment key={project.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box>
                      <Tooltip title="Cronologia versioni">
                        <IconButton 
                          edge="end" 
                          aria-label="history" 
                          onClick={() => handleOpenHistoryDialog(project)} 
                          color="info"
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifica progetto">
                        <IconButton 
                          edge="end" 
                          aria-label="edit" 
                          onClick={() => handleOpenDialog(project)} 
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina progetto">
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => onDeleteProject(project)} 
                          color="secondary"
                        >
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
                        {project.name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={project.status === 'in_corso' ? 'In Corso' : 'Nuovo'} 
                        color={project.status === 'in_corso' ? 'success' : 'info'}
                        variant="outlined"
                      />
                      {project.version && (
                        <Chip 
                          size="small" 
                          label={`v${project.version}`} 
                          color="default"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                      {project.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Ultimo aggiornamento: {new Date(project.timestamp).toLocaleString('it-IT')}
                    </Typography>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      
      {/* Dialog per aggiungere/modificare progetto */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProject ? 'Modifica Progetto' : 'Nuovo Progetto'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome Progetto"
            type="text"
            fullWidth
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Descrizione"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="project-status-label">Stato del Progetto</InputLabel>
            <Select
              labelId="project-status-label"
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              label="Stato del Progetto"
            >
              <MenuItem value="nuovo">Nuovo Progetto</MenuItem>
              <MenuItem value="in_corso">Progetto in Corso</MenuItem>
            </Select>
          </FormControl>
          
          {editingProject && editingProject.version && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Versione attuale: v{editingProject.version}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Creato il: {new Date(editingProject.versionHistory[0].timestamp).toLocaleString('it-IT')}
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                Ultima modifica: {new Date(editingProject.timestamp).toLocaleString('it-IT')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary" startIcon={<ClearIcon />}>
            Annulla
          </Button>
          <Button 
            onClick={handleSaveProject} 
            color="primary" 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={!projectName.trim()}
          >
            {editingProject ? 'Aggiorna' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog per visualizzare la cronologia delle versioni */}
      <Dialog open={historyDialogOpen} onClose={handleCloseHistoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cronologia Versioni: {selectedProject?.name}
        </DialogTitle>
        <DialogContent>
          {projectVersions.length > 0 ? (
            <List>
              {projectVersions.map((version, index) => (
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
              Nessuna cronologia disponibile per questo progetto.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryDialog} color="primary">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectManager;