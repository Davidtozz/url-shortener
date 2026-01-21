import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'pnpm build:test && dotenv -e .env.test pnpm preview', port: 4173 },
	testDir: 'src/test/e2e',
	globalSetup: 'src/test/setup/global-setup.ts',
	globalTeardown: 'src/test/setup/global-teardown.ts'
});
