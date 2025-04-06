/**
 * Servizio per l'integrazione con l'API di OpenAI (ChatGPT)
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Ottiene la chiave API dalle variabili d'ambiente
// È necessario utilizzare il prefisso VITE_ per le variabili d'ambiente accessibili dal frontend
const getApiKey = () => {
  return import.meta.env.VITE_OPENAI_API_KEY || '';
};

// Verifica se la chiave API è configurata
const isConfigured = () => {
  const apiKey = getApiKey();
  return apiKey && apiKey.trim() !== '' && !apiKey.includes('INSERISCI_QUI');
};

/**
 * Genera un documento README strutturato dalle note di un progetto utilizzando ChatGPT
 * @param {Object} project - Il progetto per cui generare il README
 * @param {Array} notes - Array di tutte le note disponibili
 * @returns {Promise<string>} - Il documento README generato
 */
const generateReadmeFromProject = async (project, notes) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key non configurata. Configura la tua chiave API OpenAI nelle impostazioni o nelle variabili d\'ambiente.');
  }
  
  if (!project) {
    throw new Error('Nessun progetto selezionato per generare il documento.');
  }
  
  // Filtra le note associate al progetto selezionato
  const projectNotes = notes.filter(note => note.projectId === project.id);
  
  if (projectNotes.length === 0) {
    return `Nessuna nota disponibile per il progetto "${project.name}". Aggiungi delle note a questo progetto per generare un README.`;
  }
  
  try {
    // Prepara il contenuto delle note in un formato leggibile
    const notesContent = projectNotes.map((note, index) => {
      return `Nota ${index + 1}:\nTitolo: ${note.title}\nContenuto: ${note.content}`;
    }).join('\n\n');
    
    // Prepara il messaggio per ChatGPT
    const messages = [
      {
        role: 'system',
        content: 'Sei un assistente che aiuta a organizzare le note di un progetto in un documento README strutturato e ben formattato. Crea un documento coerente basato sulle note fornite, organizzando le informazioni in sezioni logiche.'
      },
      {
        role: 'user',
        content: `Genera un documento README strutturato e ben formattato per il progetto "${project.name}" con la seguente descrizione: "${project.description}"\n\nNote del progetto:\n\n${notesContent}`
      }
    ];
    
    // Effettua la chiamata API a OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Errore API OpenAI: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('Errore durante la generazione del README:', error);
    throw new Error(`Impossibile generare il documento: ${error.message}`);
  }
};

/**
 * Genera un documento README strutturato dalle note utilizzando ChatGPT
 * @param {Array} notes - Array di note con titolo e contenuto
 * @returns {Promise<string>} - Il documento README generato
 * @deprecated Utilizzare generateReadmeFromProject al suo posto
 */
const generateReadmeFromNotes = async (notes) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key non configurata. Configura la tua chiave API OpenAI nelle impostazioni o nelle variabili d\'ambiente.');
  }
  
  if (!notes || notes.length === 0) {
    return 'Nessuna nota disponibile per generare il documento.';
  }
  
  try {
    // Prepara il contenuto delle note in un formato leggibile
    const notesContent = notes.map((note, index) => {
      return `Nota ${index + 1}:\nTitolo: ${note.title}\nContenuto: ${note.content}`;
    }).join('\n\n');
    
    // Prepara il messaggio per ChatGPT
    const messages = [
      {
        role: 'system',
        content: 'Sei un assistente che aiuta a organizzare le note in un documento README strutturato e ben formattato. Crea un documento coerente basato sulle note fornite, organizzando le informazioni in sezioni logiche.'
      },
      {
        role: 'user',
        content: `Genera un documento README strutturato e ben formattato basato sulle seguenti note:\n\n${notesContent}`
      }
    ];
    
    // Effettua la chiamata API a OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Errore API OpenAI: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('Errore durante la generazione del README:', error);
    throw new Error(`Impossibile generare il documento: ${error.message}`);
  }
};

export { generateReadmeFromNotes, generateReadmeFromProject, getApiKey, isConfigured };