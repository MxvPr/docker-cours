#!/bin/sh
set -e

# Attendre que MongoDB soit prêt
echo "Waiting for MongoDB to start..."
WAIT_FOR=30
until nc -z ${DB_HOST} ${DB_PORT} || [ $WAIT_FOR -lt 0 ]; do
  echo "MongoDB not available yet, waiting... ($WAIT_FOR seconds left)"
  sleep 1
  WAIT_FOR=$((WAIT_FOR-1))
done

if [ $WAIT_FOR -lt 0 ]; then
  echo "MongoDB did not start in time"
  exit 1
fi

echo "MongoDB started"

# Démarrer l'application Node.js
echo "Starting Node.js application..."
exec "$@"
