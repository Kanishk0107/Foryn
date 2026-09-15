import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const disableHmr = process.env.DISABLE_HMR === 'true';
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
      // Force HMR to use IPv4 localhost to avoid IPv6 TCP timeout errors (wsarecv).
      hmr: disableHmr
        ? false
        : {
            host: 'localhost',
            port: 3000,
            protocol: 'ws',
            clientPort: 3000,
          },
      watch: disableHmr ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react', '@hugeicons/react'],
            'vendor-motion': ['motion'],
            'vendor-d3': ['d3'],
            'vendor-supabase': ['@supabase/supabase-js']
          }
        }
      }
    }
  };
});
