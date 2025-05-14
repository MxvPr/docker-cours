# Forum Anonyme

Un forum anonyme permettant aux utilisateurs de publier des messages sous un pseudonyme sans système d'authentification.

## 🏗️ Architecture

Le projet est composé de quatre services:

- **API**: Service backend en Node.js (Express) gérant les messages du forum
- **DB**: Base de données MongoDB pour stocker les messages
- **Thread**: Frontend pour afficher les messages (port 80)
- **Sender**: Frontend pour écrire de nouveaux messages (port 8080)

![Architecture](https://via.placeholder.com/800x400?text=Architecture+du+Forum+Anonyme)

## 🚀 Installation et démarrage

### Prérequis

- Docker et Docker Compose
- Git

### Étapes d'installation

1. Clonez le dépôt:
   ```bash
   git clone <url-du-depot>
   cd forum-anonyme
   ```

2. Lancez l'application:
   ```bash
   docker-compose up -d
   ```

3. Accédez aux interfaces:
   - Lecture des messages: http://localhost
   - Écriture de messages: http://localhost:8080

## 🔧 Développement

### Structure des dossiers

```
/
├── docker-compose.yml         # Configuration Docker Compose
├── .gitlab-ci.yml             # Pipeline CI/CD
├── docker-cours/
│   └── node-service/          # Service API
│       ├── Dockerfile         # Configuration de l'image Docker
│       ├── index.js           # Code de l'API
│       └── package.json       # Dépendances Node.js
├── thread/                    # Service d'affichage des messages
│   ├── index.html             # Interface utilisateur
│   └── nginx.conf             # Configuration Nginx
└── sender/                    # Service d'écriture de messages
    ├── index.html             # Interface utilisateur
    └── nginx.conf             # Configuration Nginx
```

### Utilisation de Commitizen

Ce projet utilise [Commitizen](https://github.com/commitizen/cz-cli) pour standardiser les messages de commit selon la convention [Conventional Commits](https://www.conventionalcommits.org/).

1. Installez les dépendances:
   ```bash
   npm install
   ```

2. Pour créer un commit:
   ```bash
   git add .
   npm run commit
   ```

## 🧪 Tests

### Tests manuels

1. Vérifier que l'API est en fonctionnement:
   ```bash
   curl http://localhost/api/health
   ```

2. Créer un message:
   ```bash
   curl -X POST http://localhost/api/messages \
   -H "Content-Type: application/json" \
   -d '{"pseudo":"TestUser", "content":"Ceci est un message de test"}'
   ```

3. Récupérer les messages:
   ```bash
   curl http://localhost/api/messages
   ```

## 📦 CI/CD

Le projet est configuré avec une pipeline CI/CD qui s'exécute à chaque commit:

1. **Validate**: Vérifie le code (linting, formatting)
2. **Test**: Exécute les tests automatisés
3. **Build**: Construit les images Docker avec le tag correspondant au hash du commit
4. **Deploy**: Déploie l'application sur le serveur cible

## 📝 Fonctionnalités

- Écriture de messages avec pseudonyme
- Affichage des messages par date (plus récent en premier)
- Interface simple et réactive
- Persistance des données via MongoDB

## 📄 License

[MIT](LICENSE)
