import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, CardActions, Divider, List, ListItem, ListItemIcon, ListItemText, Chip, LinearProgress, Tooltip } from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderIcon from '@mui/icons-material/Folder';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TimelineIcon from '@mui/icons-material/Timeline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CategoryIcon from '@mui/icons-material/Category';
import UpdateIcon from '@mui/icons-material/Update';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Dashboard = ({ notes, projects, setActiveTab }) => {
  const [analysisTab, setAnalysisTab] = useState('overview');
  
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
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Benvenuto in Minerva Studio
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Minerva Studio è un'applicazione progettata per aiutarti a organizzare le tue idee e annotazioni in modo efficiente. Puoi creare, modificare e gestire note e progetti, visualizzare la cronologia delle versioni e ottenere suggerimenti per migliorare la tua produttività. Utilizza le schede in alto per navigare tra le diverse sezioni dell'applicazione.
      </Typography>
      <Divider sx={{ mb: 2 }} />
    <Box sx={{ py: 2 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 4 }}>
        Dashboard
      </Typography>
      
      {/* Statistiche */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
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
                Note Totali
              </Typography>
            </Box>
            <Typography variant="h3" color="text.primary">
              {totalNotes}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
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
                Progetti
              </Typography>
            </Box>
            <Typography variant="h3" color="text.primary">
              {totalProjects}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
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
              <UpdateIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" color="primary">
                Aggiornamenti
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
                <Typography variant="body2" color="text.secondary">
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
                <Typography variant="body2" color="text.secondary">
                  {projectVersioningPercentage.toFixed(0)}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Ultimo aggiornamento: {lastUpdated}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Sezione di Analisi */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderLeft: '4px solid', borderColor: 'secondary.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AnalyticsIcon color="secondary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" color="secondary">
            Analisi e Suggerimenti
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.primary" gutterBottom>
            <LightbulbIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'warning.main' }} />
            Suggerimenti per migliorare l'organizzazione
          </Typography>
          
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon sx={{ color: suggestion.type === 'warning' ? 'warning.main' : suggestion.type === 'success' ? 'success.main' : 'info.main' }}>
                  {suggestion.icon}
                </ListItemIcon>
                <ListItemText primary={suggestion.text} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            startIcon={<TrendingUpIcon />} 
            variant="outlined" 
            color="secondary"
            onClick={() => navigateTo('projects')}
          >
            Gestisci Progetti
          </Button>
        </Box>
      </Paper>
      
      {/* Azioni rapide */}
      <Typography variant="h5" gutterBottom color="primary" sx={{ mb: 3 }}>
        Azioni Rapide
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                NOTE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea e modifica le tue annotazioni di progetto
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                startIcon={<NoteAltIcon />} 
                variant="contained" 
                color="primary"
                onClick={() => navigateTo('editor')}
                fullWidth
              >
                Vai all'Editor
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                DATASHEET PROGETTO
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualizza la documentazione del progetto
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                startIcon={<DescriptionIcon />} 
                variant="contained" 
                color="primary"
                onClick={() => navigateTo('readme')}
                fullWidth
              >
                Vai al README
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Gestione Progetti
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea e gestisci i tuoi progetti
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                startIcon={<FolderIcon />} 
                variant="contained" 
                color="primary"
                onClick={() => navigateTo('projects')}
                fullWidth
              >
                Gestisci Progetti
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Analisi Avanzata
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualizza statistiche e suggerimenti per i tuoi progetti
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                startIcon={<AnalyticsIcon />} 
                variant="contained" 
                color="secondary"
                onClick={() => navigateTo('analysis')}
                fullWidth
              >
                Vai all'Analisi
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;