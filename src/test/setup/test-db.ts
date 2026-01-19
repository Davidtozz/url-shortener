import { PostgreSqlContainer } from '@testcontainers/postgresql';
import path from 'path';
import fs from 'fs'
import postgres from 'postgres';

let instance: any;

async function runDatabaseMigrations(client: postgres.Sql<{}>) {
	const migrationsDir: string = path.resolve(__dirname, "../../../drizzle")

	const migrations: string[] = fs
		.readdirSync(migrationsDir)
		.filter((f) => f.endsWith('.sql'))
		.sort()
	
	for(const migration of migrations) {
		const sql = fs.readFileSync(
			path.join(migrationsDir, migration), 
			'utf8'
		);
		await client.unsafe(sql);
	}
}

export async function setup() {
	instance = await new PostgreSqlContainer('postgres:16')
		.withDatabase('testdb')
		.withUsername('testuser')
		.withPassword('testpass')
		.withExposedPorts(5432)
		.start()

	const client = postgres({
		host: instance.getHost(),
		port: instance.getPort(),
		database: instance.getDatabase(),
		username: instance.getUsername(),
		password: instance.getPassword(),
	});

	await runDatabaseMigrations(client);

  // expose DB to backend
  process.env.DATABASE_URL = instance.getConnectionUri();
}

export async function teardown() {
  await instance.stop();
}
