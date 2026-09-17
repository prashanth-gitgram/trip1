import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * GitHub Pages serves under /<repo-name>/.
 * Override anytime with VITE_BASE (workflow sets this from the repo name).
 * Local `vite` / `vite preview` without VITE_BASE uses `/` for convenience.
 */
export default defineConfig(({ command }) => {
  const base =
    process.env.VITE_BASE ||
    (command === 'build' ? '/Poombarai/' : '/');

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons/*.png', 'icons/*.svg'],
        manifest: {
          name: 'Kodaikanal Backpacking Trip',
          short_name: 'Poombarai Trip',
          description:
            'Offline travel route planner: Bangalore → Poombarai → Kookal → Mannavanur → Kodaikanal',
          theme_color: '#141a14',
          background_color: '#141a14',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: './',
          scope: './',
          icons: [
            {
              src: 'icons/icon-192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: 'icons/icon-512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: 'icons/icon-maskable.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
          categories: ['travel', 'navigation'],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,png,woff2,json}'],
          navigateFallback: 'index.html',
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              // Cached by SW; populated via Download Offline Trip Area (Image prefetch)
              urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'poombarai-osm-tiles-v1',
                expiration: {
                  maxEntries: 5000,
                  maxAgeSeconds: 60 * 60 * 24 * 90,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
  };
});
