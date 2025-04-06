import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Chip, 
  LinearProgress, 
  Tooltip,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderIcon from '@mui/icons-material/Folder';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TimelineIcon from '@mui/icons-material/Timeline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CategoryIcon from '@mui/icons-material/Category';
import UpdateIcon from '@mui/icons-material/Update';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SpeedIcon from '@mui/icons-material/Speed';

const Dashboard = ({ notes, projects, setActiveTab }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Calcola statistiche avanzate
  const totalNotes = notes.length;
  const totalProjects = projects.length;
  
  // Calcola l'ultimo aggiornamento
  const lastUpdated = notes.length > 0 
    ? new Date(Math.max(...notes.map(note => new Date(note.timestamp)))).toLocaleString('it-IT')
    : 'Nessuna nota';
  
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
        icon: <CategoryIcon />
      });
    }
    
    // Suggerimenti basati sul versionamento
    if (noteVersioningPercentage < 30 && totalNotes >= 3) {
      suggestions.push({
        type: 'info',
        text: 'Solo il ' + noteVersioningPercentage.toFixed(0) + '% delle tue note ha versioni multiple. Considera di aggiornare regolarmente le tue note.',
        icon: <UpdateIcon />
      });
    }
    
    // Suggerimenti basati sui progetti
    if (projectsByStatus.in_corso > projectsByStatus.nuovo && projectsByStatus.in_corso >= 3) {
      suggestions.push({
        type: 'warning',
        text: 'Hai ' + projectsByStatus.in_corso + ' progetti in corso. Considera di completarne alcuni prima di iniziarne di nuovi.',
        icon: <PriorityHighIcon />
      });
    }
    
    // Suggerimento per roadmap
    if (totalProjects > 0) {
      suggestions.push({
        type: 'success',
        text: 'Considera di creare una roadmap per i tuoi progetti, definendo milestone e obiettivi.',
        icon: <TimelineIcon />
      });
    }
    
    // Se non ci sono suggerimenti
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'success',
        text: 'Ottimo lavoro! La tua organizzazione sembra efficace. Continua così!',
        icon: <CheckCircleOutlineIcon />
      });
    }
    
    return suggestions;
  };
  
  const suggestions = generateSuggestions();
  
  // Funzione per navigare ad altre sezioni
  const navigateTo = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3, 
            bgcolor: 'primary.main', 
            color: 'white',
            borderRadius: 1,
            mx: -2,
            mt: -2
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            BENVENUTO IN MINERVA STUDIO
          </Typography>
          <Typography variant="body1">
            La piattaforma integrata per organizzare idee, progetti e documentazione in modo efficiente.
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Minerva Studio è un'applicazione professionale progettata per aiutarti a organizzare il tuo flusso di lavoro. 
          Crea annotazioni dettagliate, gestisci progetti in modo efficiente, documenta il tuo lavoro con versioning 
          automatico e analizza l'avanzamento delle tue attività attraverso statistiche e suggerimenti personalizzati.
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Sezione Azioni Rapide */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="secondary" fontWeight="bold" sx={{ mb: 2, textTransform: 'uppercase' }}>
            AZIONI RAPIDE
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={3}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: '3px solid',
                  borderColor: 'primary.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <NoteAltIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary" sx={{ textTransform: 'uppercase', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                      NOTE
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Crea, organizza e gestisci le tue annotazioni con versioning
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Button 
                    startIcon={<NoteAltIcon />} 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigateTo('editor')}
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  >
                    EDITOR
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: '3px solid',
                  borderColor: 'primary.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FolderIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary" sx={{ textTransform: 'uppercase', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                      PROGETTI
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Crea e gestisci i tuoi progetti con monitoraggio avanzato
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Button 
                    startIcon={<FolderIcon />} 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigateTo('projects')}
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  >
                    GESTIONE
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: '3px solid',
                  borderColor: 'primary.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary" sx={{ textTransform: 'uppercase', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                      DATASHEET
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Genera documentazione strutturata dai tuoi progetti
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Button 
                    startIcon={<DescriptionIcon />} 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigateTo('readme')}
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  >
                    VISUALIZZA
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={6} md={3}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: '3px solid',
                  borderColor: 'secondary.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AnalyticsIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="secondary" sx={{ textTransform: 'uppercase', fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                      ANALISI
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    Ottieni statistiche avanzate e suggerimenti personalizzati
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Button 
                    startIcon={<AnalyticsIcon />} 
                    variant="contained" 
                    color="secondary"
                    onClick={() => navigateTo('analysis')}
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                  >
                    ANALIZZA
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        {/* Statistiche principali */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="secondary" fontWeight="bold" sx={{ mb: 2, textTransform: 'uppercase' }}>
            OVERVIEW
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderLeft: '4px solid', 
                  borderColor: 'primary.main',
                  backgroundColor: 'background.paper',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FolderIcon color="primary" sx={{ mr: 1, fontSize: { xs: 24, sm: 28 } }} />
                  <Typography variant="h6" color="primary" sx={{ textTransform: 'uppercase' }}>
                    PROGETTI
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h3" color="text.primary" fontWeight="bold">
                    {totalProjects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {projectsByStatus.in_corso > 0 ? `(${projectsByStatus.in_corso} attivi)` : ''}
                  </Typography>
                </Box>
                {totalProjects > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      size="small" 
                      label={`In Corso: ${projectsByStatus.in_corso}`} 
                      color="success" 
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip 
                      size="small" 
                      label={`Nuovi: ${projectsByStatus.nuovo}`} 
                      color="info" 
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderLeft: '4px solid', 
                  borderColor: 'primary.main',
                  backgroundColor: 'background.paper',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon color="primary" sx={{ mr: 1, fontSize: { xs: 24, sm: 28 } }} />
                  <Typography variant="h6" color="primary" sx={{ textTransform: 'uppercase' }}>
                    NOTE
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h3" color="text.primary" fontWeight="bold">
                    {totalNotes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {notesWithVersions > 0 ? `(${notesWithVersions} con versioni)` : ''}
                  </Typography>
                </Box>
                {totalNotes > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Ultimo aggiornamento: {lastUpdated}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  borderLeft: '4px solid', 
                  borderColor: 'secondary.main',
                  backgroundColor: 'background.paper',
                  borderRadius: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SpeedIcon color="secondary" sx={{ mr: 1, fontSize: { xs: 24, sm: 28 } }} />
                  <Typography variant="h6" color="secondary" sx={{ textTransform: 'uppercase' }}>
                    METRICHE
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Versionamento Note
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={noteVersioningPercentage} 
                        color="secondary" 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {noteVersioningPercentage.toFixed(0)}%
                    </Typography>
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
                    <Typography variant="body2" fontWeight="bold">
                      {projectVersioningPercentage.toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            </Grid>
        </Box>
        
        {/* Sezione di Analisi e Suggerimenti */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom color="secondary" fontWeight="bold" sx={{ mb: 2, textTransform: 'uppercase' }}>
            SUGGERIMENTI
          </Typography>
          
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderLeft: '4px solid', 
              borderColor: 'secondary.main',
              borderRadius: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon sx={{ color: 'warning.main', mr: 1, fontSize: { xs: 24, sm: 28 } }} />
              <Typography variant="subtitle1" color="text.primary" fontWeight="medium">
                MIGLIORA LA TUA PRODUTTIVITÀ
              </Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
              {suggestions.map((suggestion, index) => (
                <ListItem key={index} sx={{ py: 1, px: { xs: 0, sm: 1 }, borderRadius: 1, mb: 1, bgcolor: 'background.default' }}>
                  <ListItemIcon 
                    sx={{ 
                      color: suggestion.type === 'warning' ? 'warning.main' : 
                             suggestion.type === 'success' ? 'success.main' : 
                             'info.main',
                      minWidth: { xs: 40, sm: 56 }
                    }}
                  >
                    {suggestion.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={suggestion.text} 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      fontWeight: 'medium'
                    }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                startIcon={<TrendingUpIcon />} 
                variant="outlined" 
                color="secondary"
                onClick={() => navigateTo('analysis')}
                size={isMobile ? "small" : "medium"}
              >
                ANALISI COMPLETA
              </Button>
            </Box>
          </Paper>
        </Box>
        
        {/* Footer della dashboard */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            MINERVA STUDIO • CREATED BY METODI.PRO
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;