const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per il parsing del corpo della richiesta
app.use(express.json());

// Percorso per salvare le risposte
const responsesFile = path.join(__dirname, 'responses.txt');

// Endpoint per salvare le emozioni
app.post('/save', (req, res) => {
  const { responses } = req.body;

  if (!responses || !Array.isArray(responses)) {
    return res.status(400).send('Formato non valido. Invia un array di emozioni.');
  }

  const data = `Emozioni selezionate: ${responses.join(', ')}\n`;

  fs.appendFile(responsesFile, data, (err) => {
    if (err) {
      console.error('Errore durante il salvataggio:', err);
      return res.status(500).send('Errore durante il salvataggio delle emozioni.');
    }
    res.send('Emozioni salvate con successo!');
  });
});

// Endpoint per leggere le ultime emozioni salvate
app.get('/load', (req, res) => {
  fs.readFile(responsesFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Errore durante la lettura:', err);
      return res.status(500).send('Errore durante il caricamento delle emozioni.');
    }

    const lines = data.trim().split('\n');
    const lastResponse = lines[lines.length - 1] || 'Nessuna emozione salvata.';

    res.json({ responses: lastResponse.replace('Emozioni selezionate: ', '').split(', ') });
  });
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
