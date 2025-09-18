import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
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
          {src: '/app-icons/icon-48x48.png', sizes: '48x48', type: 'image/png'},
          {src: '/app-icons/icon-72x72.png', sizes: '72x72', type: 'image/png'},
          {src: '/app-icons/icon-96x96.png', sizes: '96x96', type: 'image/png'},
          {src: '/app-icons/icon-128x128.png', sizes: '128x128', type: 'image/png'},
          {src: '/app-icons/icon-144x144.png', sizes: '144x144', type: 'image/png'},
          {src: '/app-icons/icon-152x152.png', sizes: '152x152', type: 'image/png'},
          {src: '/app-icons/icon-192x192.png', sizes: '192x192', type: 'image/png'},
          {src: '/app-icons/icon-256x256.png', sizes: '256x256', type: 'image/png'},
          {src: '/app-icons/icon-384x384.png', sizes: '384x384', type: 'image/png'},
          {src: '/app-icons/icon-512x512.png', sizes: '512x512', type: 'image/png'},
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
