import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = ({ activeTab, setActiveTab, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'DASHBOARD', icon: <DashboardIcon />, tab: 'dashboard' },
    { text: 'PROGETTI', icon: <FolderIcon />, tab: 'projects' },
    { text: 'NOTE', icon: <NoteAltIcon />, tab: 'editor' },
    { text: 'DATASHEET PROGETTO', icon: <DescriptionIcon />, tab: 'readme' },
    { text: 'ANALISI', icon: <AnalyticsIcon />, tab: 'analysis' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        p: 2,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Box 
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{ height: 60, mb: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold">
          MINERVA STUDIO
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.tab}
            onClick={() => handleNavigate(item.tab)}
            selected={activeTab === item.tab}
            sx={{ 
              my: 0.5, 
              borderLeft: activeTab === item.tab ? '4px solid' : '4px solid transparent',
              borderColor: 'primary.main',
              bgcolor: activeTab === item.tab ? 'rgba(211, 47, 47, 0.08)' : 'transparent'
            }}
          >
            <ListItemIcon sx={{ color: activeTab === item.tab ? 'primary.main' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: activeTab === item.tab ? 'bold' : 'normal',
                color: activeTab === item.tab ? 'primary.main' : 'text.primary' 
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      {onLogout && (
        <List>
          <ListItem button onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="LOGOUT" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'primary.main',
        boxShadow: 3,
        mb: { xs: 2, sm: 3 }
      }}
    >
      <Toolbar>
        {isMobile ? (
          // Mobile view
          <>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexGrow: 1 
            }}>
              <Box 
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{ height: 40 }}
              />
            </Box>
            {onLogout && (
              <IconButton color="inherit" onClick={onLogout}>
                <LogoutIcon />
              </IconButton>
            )}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          // Desktop view
          <>
            <Box 
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ height: 40, mr: 2 }}
            />
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.tab}
                  color="inherit" 
                  startIcon={item.icon}
                  onClick={() => setActiveTab(item.tab)}
                  sx={{ 
                    mx: 1, 
                    fontWeight: activeTab === item.tab ? 'bold' : 'normal',
                    borderBottom: activeTab === item.tab ? '3px solid #ffffff' : 'none',
                    borderRadius: 0,
                    pb: 0.5,
                    fontSize: '0.9rem'
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
            {onLogout && (
              <Button 
                color="inherit" 
                startIcon={<LogoutIcon />}
                onClick={onLogout}
                sx={{ 
                  ml: 2,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.1)'
                }}
              >
                LOGOUT
              </Button>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;