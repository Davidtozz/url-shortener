#!/bin/bash
set -euo pipefail

docker compose up --build -d db
echo "Waiting for the database to be ready..."
until docker compose exec db pg_isready > /dev/null 2>&1; do
  sleep 1
done
echo "Database is ready."
docker compose up --build -d app
echo "Applying database migrations..."

dotenv -e .env pnpm db:migrate