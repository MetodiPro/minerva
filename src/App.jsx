// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Box, Container, Typography, Paper, Grid, Tabs, Tab, Divider } from '@mui/material'
import NoteEditor from './components/NoteEditor'
import NoteList from './components/NoteList'
import EnhancedReadmeViewer from './components/EnhancedReadmeViewer'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import ProjectManager from './components/ProjectManager'
import ProjectAnalysis from './components/ProjectAnalysis'
import Login from './components/Login'

function App() {
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingNote, setEditingNote] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verifica se l'utente è autenticato al caricamento
  useEffect(() => {
    const auth = localStorage.getItem('minerva_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    
    // Carica le note e i progetti dal localStorage
    const savedNotes = localStorage.getItem('minerva_notes');
    const savedProjects = localStorage.getItem('minerva_projects');
    
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Errore nel parsing delle note:', e);
      }
    }
    
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error('Errore nel parsing dei progetti:', e);
      }
    }
  }, []);
  
  // Salva le note nel localStorage quando cambiano
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('minerva_notes', JSON.stringify(notes));
    }
  }, [notes]);
  
  // Salva i progetti nel localStorage quando cambiano
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('minerva_projects', JSON.stringify(projects));
    }
  }, [projects]);
  
  const handleSaveNote = (newNote) => {
    if (editingNote) {
      // Aggiorna una nota esistente
      setNotes(notes.map(note => 
        note.timestamp === editingNote.timestamp ? {...newNote, timestamp: note.timestamp} : note
      ));
      setEditingNote(null);
    } else {
      // Aggiungi una nuova nota
      setNotes([newNote, ...notes]);
    }
  };
  
  const handleDeleteNote = (noteToDelete) => {
    setNotes(notes.filter(note => note.timestamp !== noteToDelete.timestamp));
    if (editingNote && editingNote.timestamp === noteToDelete.timestamp) {
      setEditingNote(null);
    }
  };
  
  const handleEditNote = (noteToEdit) => {
    setEditingNote(noteToEdit);
    setActiveTab('editor'); // Passa alla tab dell'editor
  };
  
  const handleSaveProject = (newProject) => {
    console.log('Salvataggio progetto:', newProject); // Log per debug
    
    // Verifica se esiste già un progetto con questo ID
    const existingProject = projects.find(project => project.id === newProject.id);
    
    if (existingProject) {
      // Aggiorna un progetto esistente
      setProjects(projects.map(project => 
        project.id === newProject.id ? newProject : project
      ));
      console.log('Progetto aggiornato:', newProject.id);
    } else {
      // Aggiungi un nuovo progetto
      console.log('Nuovo progetto aggiunto:', newProject.id);
      setProjects([newProject, ...projects]);
    }
  };
  
  const handleDeleteProject = (projectToDelete) => {
    setProjects(projects.filter(project => project.id !== projectToDelete.id));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('minerva_authenticated');
    setIsAuthenticated(false);
  };
  
  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 2 }}>
        {activeTab === 'editor' ? (
          <>
            <NoteEditor 
              onSave={handleSaveNote} 
              initialNote={editingNote}
              projects={projects}
            />
            <NoteList 
              notes={notes} 
              projects={projects}
              onDelete={handleDeleteNote} 
              onEdit={handleEditNote} 
            />
          </>
        ) : activeTab === 'readme' ? (
          <EnhancedReadmeViewer notes={notes} projects={projects} />
        ) : activeTab === 'projects' ? (
          <ProjectManager 
            projects={projects} 
            onSaveProject={handleSaveProject} 
            onDeleteProject={handleDeleteProject} 
          />
        ) : activeTab === 'analysis' ? (
          <ProjectAnalysis 
            notes={notes} 
            projects={projects} 
            setActiveTab={setActiveTab} 
          />
        ) : (
          <Dashboard notes={notes} projects={projects} setActiveTab={setActiveTab} />
        )}
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: 'primary.dark',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Minerva Studio - La tua piattaforma per annotazioni e organizzazione di idee
        </Typography>
      </Box>
    </Box>
  )
}

export default App