const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

// Import de l'app (ajustez le chemin si nécessaire)
let app;

beforeAll(async () => {
  // Configurer une base de données MongoDB en mémoire pour les tests
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '27017';
  process.env.DB_NAME = 'test';
  
  // Utiliser un mock pour mongoose.connect
  mongoose.connect = jest.fn().mockImplementation(() => {
    return Promise.resolve();
  });
  
  // Charger l'app après avoir configuré les variables d'environnement
  app = require('../index');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('API Tests', () => {
  test('GET /health should return status OK', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
  });

  test('GET /messages should return an array', async () => {
    const response = await request(app).get('/messages');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('POST /messages should create a new message', async () => {
    const message = {
      pseudo: 'TestUser',
      content: 'Message de test'
    };
    
    // Mock de la méthode save de mongoose
    const mockSave = jest.fn().mockResolvedValue({
      ...message,
      _id: '123456789',
      timestamp: new Date()
    });
    
    mongoose.model = jest.fn().mockImplementation(() => {
      return class {
        constructor(data) {
          this.pseudo = data.pseudo;
          this.content = data.content;
          this.save = mockSave;
        }
      };
    });
    
    const response = await request(app)
      .post('/messages')
      .send(message);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('pseudo', message.pseudo);
    expect(response.body).toHaveProperty('content', message.content);
  });
});
