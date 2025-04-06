import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'primary.main',
        mb: 3,
        boxShadow: 3
      }}
    >
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Box 
            component="img"
            src="/public/favicon.svg"
            alt="Logo"
            sx={{ height: 32, mr: 1 }}
          />
          Minerva Studio
        </Typography>
        
        <Box sx={{ display: 'flex' }}>
          <Button 
            color="inherit" 
            startIcon={<DashboardIcon />}
            onClick={() => setActiveTab('dashboard')}
            sx={{ 
              mx: 1, 
              fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
              borderBottom: activeTab === 'dashboard' ? '3px solid #ffffff' : 'none',
              borderRadius: 0,
              pb: 0.5
            }}
          >
            Dashboard
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<NoteAltIcon />}
            onClick={() => setActiveTab('editor')}
            sx={{ 
              mx: 1, 
              fontWeight: activeTab === 'editor' ? 'bold' : 'normal',
              borderBottom: activeTab === 'editor' ? '3px solid #ffffff' : 'none',
              borderRadius: 0,
              pb: 0.5
            }}
          >
            NOTE
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<DescriptionIcon />}
            onClick={() => setActiveTab('readme')}
            sx={{ 
              mx: 1, 
              fontWeight: activeTab === 'readme' ? 'bold' : 'normal',
              borderBottom: activeTab === 'readme' ? '3px solid #ffffff' : 'none',
              borderRadius: 0,
              pb: 0.5
            }}
          >
            DATASHEET PROGETTO
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<FolderIcon />}
            onClick={() => setActiveTab('projects')}
            sx={{ 
              mx: 1, 
              fontWeight: activeTab === 'projects' ? 'bold' : 'normal',
              borderBottom: activeTab === 'projects' ? '3px solid #ffffff' : 'none',
              borderRadius: 0,
              pb: 0.5
            }}
          >
            Progetti
          </Button>
          
          <Button 
            color="inherit" 
            startIcon={<AnalyticsIcon />}
            onClick={() => setActiveTab('analysis')}
            sx={{ 
              mx: 1, 
              fontWeight: activeTab === 'analysis' ? 'bold' : 'normal',
              borderBottom: activeTab === 'analysis' ? '3px solid #ffffff' : 'none',
              borderRadius: 0,
              pb: 0.5
            }}
          >
            Analisi
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;