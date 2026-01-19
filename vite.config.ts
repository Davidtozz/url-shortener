import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

const cacheDir =
  process.env.NODE_ENV === 'development-docker'
    ? '/app/node_modules/.vite'
    : 'node_modules/.vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  cacheDir,

  test: {
    expect: { requireAssertions: true },
    globalSetup: ['./src/test/setup/test-db.ts'],
    projects: [
      {
        extends: './vite.config.ts',

        test: {
          name: 'client',

          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium', headless: false }]
          },

          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**']
        }
      },

      {
        extends: './vite.config.ts',

        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        }
      }
    ]
  }
});
