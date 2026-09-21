import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import createQuoteApiPlugin from './server/generateQuoteApi.js';

export default defineConfig(({ command }) => ({
  plugins: [react(), createQuoteApiPlugin()],
  base: command === 'build' && process.env.GITHUB_PAGES === 'true' ? '/vibecodingpractice/' : '/',
  server: {
    port: 5173,
    strictPort: true,
  },
}));
