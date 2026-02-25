import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'service-worker.js',
      manifest: {
        name: "Dahenfeld",
        short_name: "Dahenfeld",
        description: "Mit dieser App erhalten Sie einen schnellen und einfachen Zugriff auf aktuelle Meldungen der Gemeinde Dahenfeld.",
        icons: [
          { "src": "/favicon.ico", "type": "image/x-icon", "sizes": "16x16 32x32" },
          { "src": "/app-icons/icon-192.png", "type": "image/png", "sizes": "192x192" },
          { "src": "/app-icons/icon-512.png", "type": "image/png", "sizes": "512x512" },
          { "src": "/app-icons/icon-192-maskable.png", "type": "image/png", "sizes": "192x192", "purpose": "maskable" },
          { "src": "/app-icons/icon-512-maskable.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" },
        ],
        screenshots: [
          {src: 'app-screenshots/screenshot-1.png', sizes: "1080x1903", type: 'image/png'}
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
