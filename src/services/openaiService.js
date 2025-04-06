/**
 * Servizio per l'integrazione con l'API di OpenAI (ChatGPT)
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Chiave API di OpenAI configurata direttamente nel codice per l'utilizzo su server AWS
// Sostituire 'INSERISCI_QUI_LA_TUA_CHIAVE_API' con la tua chiave API reale
const OPENAI_API_KEY = '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';

// Recupera la chiave API configurata direttamente nel codice
const getApiKey = () => {
  return OPENAI_API_KEY;
};

// Funzione mantenuta per retrocompatibilità ma non più utilizzata
const saveApiKey = (apiKey, remember = true) => {
  console.log('La chiave API è ora configurata direttamente nel codice e non può essere modificata dall\'interfaccia utente.');
  return;
};

// Verifica se la chiave API è configurata
const isConfigured = () => {
  return OPENAI_API_KEY !== 'INSERISCI_QUI_LA_TUA_CHIAVE_API';
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
    throw new Error('API key non configurata. Configura la tua chiave API OpenAI nelle impostazioni.');
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
    throw new Error('API key non configurata. Configura la tua chiave API OpenAI nelle impostazioni.');
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

export { generateReadmeFromNotes, generateReadmeFromProject, getApiKey, saveApiKey, isConfigured };