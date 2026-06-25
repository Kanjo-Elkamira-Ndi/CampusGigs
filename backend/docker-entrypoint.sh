#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
node dist/scripts/wait-for-db.js

echo "Running database migrations..."
node dist/scripts/migrate.js

echo "Starting server..."
exec node dist/src/server.js
