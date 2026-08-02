import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // Completely disable HMR to prevent websocket disconnects from triggering page reloads
      hmr: false,
      watch: process.env.DISABLE_HMR === 'true' ? { ignored: ['**/*'] } : {},
    },
  };
});
