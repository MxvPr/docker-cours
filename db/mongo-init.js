db = db.getSiblingDB('forum');

// Créer des indexes pour améliorer les performances
db.messages.createIndex({ timestamp: -1 });
db.messages.createIndex({ pseudo: 1 });

// Insérer quelques messages pour le démarrage (optionnel)
db.messages.insertMany([
  {
    pseudo: "Admin",
    content: "Bienvenue sur le forum anonyme!",
    timestamp: new Date()
  },
  {
    pseudo: "Guide",
    content: "Vous pouvez écrire des messages en utilisant l'interface d'écriture à l'adresse http://localhost:8080",
    timestamp: new Date()
  }
]);

print("Base de données et collection initialisées avec succès!");
