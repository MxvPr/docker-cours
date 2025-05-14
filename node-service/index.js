const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect('mongodb://forum-db:27017/forum', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Schéma de message
const messageSchema = new mongoose.Schema({
  pseudo: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

// Route de vérification de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Route pour récupérer tous les messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour créer un nouveau message
app.post('/api/messages', async (req, res) => {
  try {
    const { pseudo, content } = req.body;
    if (!pseudo || !content) {
      return res.status(400).json({ message: 'Le pseudo et le contenu sont requis' });
    }
    
    const newMessage = new Message({
      pseudo,
      content
    });
    
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
