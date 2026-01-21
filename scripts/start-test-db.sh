#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
cd "$ROOT_DIR"

CONTAINER_NAME="url-shortener-test-db"
POSTGRES_IMAGE="postgres:16"
DB_USER="testuser"
DB_PASS="testpass"
DB_NAME="testdb"

echo "Checking if Docker Desktop is running..."
docker desktop start

echo "Starting the test container"
docker run -d --rm --name url-shortener-test-db \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASS \
  -e POSTGRES_DB=$DB_NAME \
  -p 5432:5432 \
  postgres:16

until docker exec "$CONTAINER_NAME" pg_isready -U "$DB_USER" > /dev/null 2>&1; do
  echo "Waiting for the database to be ready..."
  sleep 1
done

echo "Database ready for tests."

docker attach "$CONTAINER_NAME"