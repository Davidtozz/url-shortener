import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import path from 'path';
import fs from 'fs'
import postgres from 'postgres';
import { exec } from 'child_process';

async function runDatabaseMigrations(client: postgres.Sql<{}>) {
	const migrationsDir: string = path.resolve(import.meta.dirname, "../../../drizzle")

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

export default async function setup() {

	const client = postgres({
		host: 'localhost',
		port: 5432,
		database: 'testdb',
		username: 'testuser',
		password: 'testpass',
	});

	await runDatabaseMigrations(client);
	
}