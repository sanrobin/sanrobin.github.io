import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-admin-html',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ? req.url.split('?')[0] : '';
          if (url === '/admin' || url === '/admin/') {
            try {
              const adminHtml = fs.readFileSync(path.resolve(__dirname, 'admin.html'), 'utf8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              return res.end(adminHtml);
            } catch (err) {
              return next(err);
            }
          }
        });
      }
    }
  ],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main:  path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
      output: {
        // Keep admin assets in their own folder
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.includes('admin')) return 'admin/assets/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
})

