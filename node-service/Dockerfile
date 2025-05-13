FROM node:16-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances (avec gestion d'erreur si package.json n'existe pas)
RUN if [ -f package.json ]; then npm install; else echo "No package.json found, skipping npm install"; fi

# Copie du reste des fichiers du projet
COPY . .

# Exposition du port pour l'API
EXPOSE 3000

# Ajout d'une commande healthcheck pour les vérifications de santé
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
