import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Chip, Card, CardContent, LinearProgress, Tooltip } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CategoryIcon from '@mui/icons-material/Category';
import UpdateIcon from '@mui/icons-material/Update';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProjectAnalysis = ({ notes, projects, setActiveTab }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Calcola statistiche avanzate
  const totalNotes = notes.length;
  const totalProjects = projects.length;
  
  // Calcola statistiche per categorie
  const notesByCategory = {
    progetto_in_corso: notes.filter(note => note.category === 'progetto_in_corso').length,
    nuovo_progetto: notes.filter(note => note.category === 'nuovo_progetto').length,
    generale: notes.filter(note => note.category === 'generale' || !note.category).length
  };
  
  const projectsByStatus = {
    in_corso: projects.filter(project => project.status === 'in_corso').length,
    nuovo: projects.filter(project => project.status === 'nuovo').length
  };
  
  // Calcola statistiche di versioning
  const notesWithVersions = notes.filter(note => note.version && note.version > 1).length;
  const projectsWithVersions = projects.filter(project => project.version && project.version > 1).length;
  
  // Calcola la percentuale di note e progetti con versioni
  const noteVersioningPercentage = totalNotes > 0 ? (notesWithVersions / totalNotes) * 100 : 0;
  const projectVersioningPercentage = totalProjects > 0 ? (projectsWithVersions / totalProjects) * 100 : 0;
  
  // Genera suggerimenti di analisi
  const generateSuggestions = () => {
    const suggestions = [];
    
    // Suggerimenti basati sulle categorie
    if (notesByCategory.progetto_in_corso === 0 && totalNotes > 0) {
      suggestions.push({
        type: 'warning',
        text: 'Non hai note categorizzate come "Progetti in Corso". Considera di organizzare meglio le tue note.',
        icon: <CategoryIcon />,
        action: 'Vai all\'editor per categorizzare le note',
        actionTab: 'editor'
      });
    }
    
    // Suggerimenti basati sul versionamento
    if (noteVersioningPercentage < 30 && totalNotes >= 3) {
      suggestions.push({
        type: 'info',
        text: 'Solo il ' + noteVersioningPercentage.toFixed(0) + '% delle tue note ha versioni multiple. Considera di aggiornare regolarmente le tue note.',
        icon: <UpdateIcon />,
        action: 'Aggiorna le tue note',
        actionTab: 'editor'
      });
    }
    
    // Suggerimenti basati sui progetti
    if (projectsByStatus.in_corso > projectsByStatus.nuovo && projectsByStatus.in_corso >= 3) {
      suggestions.push({
        type: 'warning',
        text: 'Hai ' + projectsByStatus.in_corso + ' progetti in corso. Considera di completarne alcuni prima di iniziarne di nuovi.',
        icon: <PriorityHighIcon />,
        action: 'Gestisci i tuoi progetti',
        actionTab: 'projects'
      });
    }
    
    // Suggerimento per roadmap
    if (totalProjects > 0) {
      suggestions.push({
        type: 'success',
        text: 'Considera di creare una roadmap per i tuoi progetti, definendo milestone e obiettivi.',
        icon: <TimelineIcon />,
        action: 'Crea una roadmap',
        actionTab: 'projects'
      });
    }
    
    // Se non ci sono suggerimenti
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        text: 'Ottimo lavoro! La tua organizzazione sembra efficace. Continua così!',
        icon: <CheckCircleOutlineIcon />,
        action: 'Continua il tuo lavoro',
        actionTab: 'dashboard'
      });
    }
    
    return suggestions;
  };
  
  const suggestions = generateSuggestions();
  
  // Genera una roadmap suggerita per i progetti
  const generateRoadmap = () => {
    if (projects.length === 0) return [];
    
    // Ordina i progetti per stato (prima i progetti in corso)
    const sortedProjects = [...projects].sort((a, b) => {
      if (a.status === 'in_corso' && b.status !== 'in_corso') return -1;
      if (a.status !== 'in_corso' && b.status === 'in_corso') return 1;
      return 0;
    });
    
    // Crea una roadmap con milestone suggerite
    return sortedProjects.map(project => ({
      project: project,
      milestones: [
        {
          title: 'Pianificazione',
          completed: project.status === 'in_corso',
          description: 'Definizione degli obiettivi e delle risorse necessarie'
        },
        {
          title: 'Sviluppo',
          completed: project.status === 'in_corso' && project.version > 1,
          description: 'Implementazione delle funzionalità principali'
        },
        {
          title: 'Test',
          completed: false,
          description: 'Verifica della qualità e correzione dei problemi'
        },
        {
          title: 'Rilascio',
          completed: false,
          description: 'Finalizzazione e distribuzione del progetto'
        }
      ]
    }));
  };
  
  const roadmap = generateRoadmap();
  
  // Funzione per navigare ad altre sezioni
  const navigateTo = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
          Analisi Avanzata
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigateTo('dashboard')}
        >
          Torna alla Dashboard
        </Button>
      </Box>
      
      {/* Statistiche avanzate */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderLeft: '4px solid', 
              borderColor: 'primary.main',
              backgroundColor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" color="primary">
                Analisi Note
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Distribuzione per Categoria
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Tooltip title="Note di progetti in corso">
                  <Chip 
                    size="small" 
                    label={`In Corso: ${notesByCategory.progetto_in_corso}`} 
                    color="success" 
                    variant="outlined" 
                  />
                </Tooltip>
                <Tooltip title="Note di nuovi progetti">
                  <Chip 
                    size="small" 
                    label={`Nuovi: ${notesByCategory.nuovo_progetto}`} 
                    color="info" 
                    variant="outlined" 
                  />
                </Tooltip>
                <Tooltip title="Note generali">
                  <Chip 
                    size="small" 
                    label={`Generali: ${notesByCategory.generale}`} 
                    color="default" 
                    variant="outlined" 
                  />
                </Tooltip>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Versionamento Note
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={noteVersioningPercentage} 
                    color="secondary" 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {noteVersioningPercentage.toFixed(0)}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {notesWithVersions} note su {totalNotes} hanno versioni multiple
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderLeft: '4px solid', 
              borderColor: 'primary.main',
              backgroundColor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FolderIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" color="primary">
                Analisi Progetti
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Distribuzione per Stato
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Tooltip title="Progetti in corso">
                  <Chip 
                    size="small" 
                    label={`In Corso: ${projectsByStatus.in_corso}`} 
                    color="success" 
                    variant="outlined" 
                  />
                </Tooltip>
                <Tooltip title="Nuovi progetti">
                  <Chip 
                    size="small" 
                    label={`Nuovi: ${projectsByStatus.nuovo}`} 
                    color="info" 
                    variant="outlined" 
                  />
                </Tooltip>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Versionamento Progetti
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={projectVersioningPercentage} 
                    color="primary" 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {projectVersioningPercentage.toFixed(0)}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {projectsWithVersions} progetti su {totalProjects} hanno versioni multiple
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Suggerimenti */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderLeft: '4px solid', borderColor: 'secondary.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AnalyticsIcon color="secondary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" color="secondary">
            Suggerimenti per Migliorare
          </Typography>
        </Box>
        
        <List>
          {suggestions.map((suggestion, index) => (
            <ListItem key={index} sx={{ py: 1, px: 0 }}>
              <ListItemIcon sx={{ color: suggestion.type === 'warning' ? 'warning.main' : suggestion.type === 'success' ? 'success.main' : 'info.main' }}>
                {suggestion.icon}
              </ListItemIcon>
              <ListItemText 
                primary={suggestion.text} 
                secondary={
                  <Button 
                    size="small" 
                    variant="text" 
                    color="primary" 
                    onClick={() => navigateTo(suggestion.actionTab)}
                    sx={{ mt: 1 }}
                  >
                    {suggestion.action}
                  </Button>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      {/* Roadmap Suggerita */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderLeft: '4px solid', borderColor: 'secondary.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TimelineIcon color="secondary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" color="secondary">
            Roadmap Suggerita
          </Typography>
        </Box>
        
        {roadmap.length > 0 ? (
          <Grid container spacing={3}>
            {roadmap.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color="primary">
                        {item.project.name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={item.project.status === 'in_corso' ? 'In Corso' : 'Nuovo'} 
                        color={item.project.status === 'in_corso' ? 'success' : 'info'}
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.project.description}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Milestone Suggerite:
                    </Typography>
                    
                    <List dense>
                      {item.milestones.map((milestone, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Chip 
                              size="small" 
                              label={idx + 1} 
                              color={milestone.completed ? 'success' : 'default'}
                              variant={milestone.completed ? 'filled' : 'outlined'}
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={milestone.title} 
                            secondary={milestone.description}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: milestone.completed ? 'success.main' : 'text.primary',
                              fontWeight: milestone.completed ? 'bold' : 'normal'
                            }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Non hai ancora creato progetti. Crea un progetto per visualizzare una roadmap suggerita.
          </Typography>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<FolderIcon />}
          onClick={() => navigateTo('projects')}
          sx={{ mr: 2 }}
        >
          Gestisci Progetti
        </Button>
        <Button 
          variant="outlined" 
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigateTo('dashboard')}
        >
          Torna alla Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectAnalysis;