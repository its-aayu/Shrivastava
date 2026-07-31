import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.svg", "robots.txt"],
      manifest: {
        name: "VELORA",
        short_name: "Velora",
        description:
          "Custom-printed apparel and personalised gifts, made to order in India.",
        theme_color: "#5B1A26",
        background_color: "#F8F2E9",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icons/icon-maskable.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
          {
            src: "/icons/apple-touch-icon.svg",
            sizes: "180x180",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        navigateFallback: "/offline.html",
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Never cache API responses
            urlPattern: /^https?:\/\/.*\/api\//,
            handler: "NetworkOnly",
          },
          {
            // Product and site images — serve stale, refresh in background
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "velora-images",
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
            },
          },
          {
            // Cloudinary image CDN
            urlPattern: /^https:\/\/res\.cloudinary\.com\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "velora-cloudinary",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
              },
            },
          },
          {
            // Google Fonts CSS — cache first, rarely changes
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "velora-google-fonts-css",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
            },
          },
          {
            // Google Fonts binaries
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "velora-google-fonts-assets",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
