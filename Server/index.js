const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

// Inizializza Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<collegarti-e9b20>.firebaseio.com" 
});

const db = admin.firestore();

// Middleware per gestire JSON
app.use(express.json());

// Esempio di API per ottenere dati da una collezione Firestore
app.get('/api/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const data = snapshot.docs.map(doc => {
      console.log(doc.id, '=>', doc.data());  // Add logging here
      return doc.data();
    });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Errore nel recupero dei dati');
  }
});

app.get('/api/requests', async (req, res) => {
  try {
    const snapshot = await db.collection('requests').get();
    const data = snapshot.docs.map(doc => {
      console.log(doc.id, '=>', doc.data());
      return doc.data();
    });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Errore nel recupero dei dati');
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const snapshot = await db.collection('events').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send('Errore nel recupero dei dati');
  }
});
// Avvio del server
app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
