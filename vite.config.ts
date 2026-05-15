import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'

const buildSha = (() => {
  try { return execSync('git rev-parse --short HEAD').toString().trim() }
  catch { return 'dev' }
})()
const buildTime = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'og-image.png'],
      manifest: {
        name: '石少斌 Shih Shao Pin - 全端工程師',
        short_name: '石少斌 Portfolio',
        description: '4年Unity/全端工程師，專精遊戲開發與現代化Web技術',
        theme_color: '#264653',
        background_color: '#fef9f4',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'zh-TW',
        start_url: '/',
        icons: [
          { src: '/vite.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/og-image.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-i18n'],
        },
      },
    },
    target: 'es2020',
  },
})
