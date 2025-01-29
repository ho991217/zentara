import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
