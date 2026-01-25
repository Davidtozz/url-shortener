Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$CONTAINER_NAME = 'url-shortener-test-db'
$POSTGRES_IMAGE = 'postgres:16'
$DB_USER = 'testuser'
$DB_PASS = 'testpass'
$DB_NAME = 'testdb'

echo "Checking if Docker Desktop is running..."
& docker desktop start

# If a container with the same name exists, remove it first to avoid conflict
$existing = & docker ps -a --format '{{.Names}}' 2>$null
if ($existing -contains $CONTAINER_NAME) {
  echo "A container named '$CONTAINER_NAME' already exists — removing it..."
  & docker rm -f $CONTAINER_NAME > $null 2>&1 || echo "Failed to remove existing container (continuing)."
}

echo "Starting the test container"
& docker run -d --rm --name $CONTAINER_NAME `
  -e POSTGRES_USER=$DB_USER `
  -e POSTGRES_PASSWORD=$DB_PASS `
  -e POSTGRES_DB=$DB_NAME `
  -p 5432:5432 `
  $POSTGRES_IMAGE

# Wait until the database is ready
do {
  & docker exec $CONTAINER_NAME pg_isready -U $DB_USER > $null 2>&1
  $ready = $LASTEXITCODE -eq 0
  if (-not $ready) {
    echo "Waiting for the database to be ready..."
    Start-Sleep -Seconds 1
  }
} until ($ready)

echo "Database ready for tests."
echo "Applying database migrations (drizzle-kit)..."

# Try using npx or dotenv if available, otherwise instruct user
if (Get-Command npx -ErrorAction SilentlyContinue) {
  & npx dotenv -e .env.test pnpm db:migrate
} elseif (Get-Command dotenv -ErrorAction SilentlyContinue) {
  & dotenv -e .env.test pnpm db:migrate
} else {
  echo "npx or dotenv not found — run 'dotenv -e .env.test pnpm db:migrate' manually."
}

echo "Migrations applied (or skipped)."
