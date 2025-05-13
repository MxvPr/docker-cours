const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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
    res.status(500).json({ error: err.message });
  }
});

// Créer un nouveau message
app.post('/messages', async (req, res) => {
  try {
    const { pseudo, content } = req.body;
    const message = new Message({ pseudo, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint de test pour vérifier rapidement le fonctionnement
app.get('/test', (req, res) => {
  res.json({
    message: "L'API fonctionne correctement",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
