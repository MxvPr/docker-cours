/**
 * Script de test manuel pour l'API Forum
 * 
 * Ce script effectue des requêtes HTTP vers l'API pour vérifier son bon fonctionnement
 */

const http = require('http');
const https = require('https');

const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 3000;
const API_URL = `http://${API_HOST}:${API_PORT}`;

console.log(`🧪 Démarrage des tests manuels sur ${API_URL}`);

// Fonction helper pour les requêtes HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: responseData,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Tests
async function runTests() {
  try {
    // Test 1: Health check
    console.log('Test 1: Vérification de /health');
    const healthResponse = await makeRequest('GET', '/health');
    console.log(`✅ Statut: ${healthResponse.statusCode}, Réponse:`, healthResponse.data);

    // Test 2: Test endpoint
    console.log('\nTest 2: Vérification de /test');
    const testResponse = await makeRequest('GET', '/test');
    console.log(`✅ Statut: ${testResponse.statusCode}, Réponse:`, testResponse.data);

    // Test 3: Post message
    console.log('\nTest 3: Création d\'un message');
    const newMessage = {
      pseudo: 'TestUser',
      content: `Message de test créé le ${new Date().toISOString()}`
    };
    const createResponse = await makeRequest('POST', '/messages', newMessage);
    console.log(`✅ Statut: ${createResponse.statusCode}, Message créé:`, createResponse.data);

    // Test 4: Get messages
    console.log('\nTest 4: Récupération des messages');
    const getResponse = await makeRequest('GET', '/messages');
    console.log(`✅ Statut: ${getResponse.statusCode}, Nombre de messages: ${getResponse.data.length}`);
    console.log('Premier message:', getResponse.data[0]);

    console.log('\n✅ Tous les tests ont réussi !');
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

runTests();
