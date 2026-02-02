#!/bin/bash
set -euo pipefail

docker desktop start

echo "Starting production build..."
docker compose up -d --build
until docker compose exec db pg_isready > /dev/null 2>&1; do
  sleep 1
done
echo "Applying database migrations..."

dotenv -e .env pnpm db:migrate
ORIGIN=$(grep ORIGIN .env | cut -d '=' -f2)
echo "The app is running at $ORIGIN"