const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost', 'http://localhost:8080', 'http://thread', 'http://sender'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Connexion à MongoDB
const DB_HOST = process.env.DB_HOST || 'db';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'forum';

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Modèle de message
const Message = mongoose.model('Message', {
  pseudo: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Récupérer tous les messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Erreur lors de la récupération des messages:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// Créer un nouveau message
app.post('/messages', async (req, res) => {
  try {
    console.log('Requête reçue:', req.body);
    const { pseudo, content } = req.body;
    
    if (!pseudo || !content) {
      return res.status(400).json({ error: 'Le pseudo et le contenu sont requis' });
    }
    
    const message = new Message({ pseudo, content });
    await message.save();
    console.log('Message enregistré:', message);
    res.status(201).json(message);
  } catch (err) {
    console.error('Erreur lors de la création du message:', err);
    res.status(400).json({ error: err.message });
  }
});

// Route de test pour le débogage
app.get('/test', (req, res) => {
  res.json({
    message: 'API fonctionnelle',
    time: new Date().toISOString(),
    env: {
      DB_HOST,
      DB_PORT,
      DB_NAME
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
