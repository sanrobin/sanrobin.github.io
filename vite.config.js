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
              const adminHtml = fs.readFileSync(path.resolve(__dirname, 'public/admin/index.html'), 'utf8');
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
})
