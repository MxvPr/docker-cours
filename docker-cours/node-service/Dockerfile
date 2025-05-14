FROM node:16-alpine

# Installation de netcat pour le script d'attente
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du projet
COPY . .

# Rendre le script d'entrée exécutable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exposition du port
EXPOSE 3000

# Point d'entrée pour attendre MongoDB
ENTRYPOINT ["docker-entrypoint.sh"]

# Commande pour démarrer l'application
CMD ["node", "index.js"]
