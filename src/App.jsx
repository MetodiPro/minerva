import React, { useState, useEffect } from 'react'
import { Box, Container, Typography, Paper, Grid, Tabs, Tab, Divider } from '@mui/material'
import NoteEditor from './components/NoteEditor'
import NoteList from './components/NoteList'
import EnhancedReadmeViewer from './components/EnhancedReadmeViewer'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import ProjectManager from './components/ProjectManager'
import ProjectAnalysis from './components/ProjectAnalysis'

function App() {
  const [notes, setNotes] = useState([]);
  
  const [projects, setProjects] = useState([]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingNote, setEditingNote] = useState(null);
  
  // Salva le note nel localStorage quando cambiano
  
  
  // Salva i progetti nel localStorage quando cambiano
  
  
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
    localStorage.removeItem('minerva_notes');
    localStorage.removeItem('minerva_projects');
    setNotes([]);
    setProjects([]);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
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