# PowerShell version of run.sh
# Usage: Open PowerShell and run: .\run.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

echo "Starting Postgres service..."
& docker compose up --build -d db

echo "Waiting for the database to be ready..."

do {
    & docker compose exec db pg_isready > $null 2>&1
    $ready = $LASTEXITCODE -eq 0
    if (-not $ready) { Start-Sleep -Seconds 1 }
} until ($ready)

echo "Database is ready."

echo "Starting app service..."
& docker compose up --build -d app

echo "Applying database migrations..."
# Use dotenv and pnpm as in the original script
& dotenv -e .env pnpm db:migrate

echo "Migrations complete."