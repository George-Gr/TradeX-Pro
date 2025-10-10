import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom') ||
              id.includes('@tanstack/react-query')
            ) {
              return 'vendor';
            }
            return 'deps';
          }
          if (
            id.includes('/pages/Trading') ||
            id.includes('/pages/Portfolio') ||
            id.includes('/pages/OrderHistory')
          ) {
            return 'trading';
          }
          if (id.includes('/pages/Login') || id.includes('/pages/Signup')) {
            return 'auth';
          }
          if (id.includes('components/ui')) {
            return 'ui';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}));
