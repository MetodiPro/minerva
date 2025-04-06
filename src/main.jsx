import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Rosso
      light: '#ef5350',
      dark: '#b71c1c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000', // Nero
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff', // Bianco
      paper: '#f8f8f8',
    },
    text: {
      primary: '#000000',
      secondary: '#757575', // Grigio
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowX: 'hidden',
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)