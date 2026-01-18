import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const cacheDir =
  process.env.NODE_ENV === 'development-docker'
    ? '/app/node_modules/.vite'
    : 'node_modules/.vite';

export default defineConfig({ 
    plugins: [tailwindcss(), sveltekit()], 
    cacheDir: cacheDir
});
