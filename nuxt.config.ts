// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  /** Avoid Vite pre-transform "Failed to resolve #app-manifest" noise in dev; we do not rely on client app manifest / route rules. */
  experimental: {
    appManifest: false,
  },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@vite-pwa/nuxt"],
  pwa: {
    manifest: {
      name: "Monta Bike - Simulador",
      short_name: "Monta Bike",
      description: "Simulador completo de montagem de bicicletas MTB.",
      theme_color: "#2563eb",
      background_color: "#ffffff",
      icons: [
        {
          src: "icon.svg",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "gstatic-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          // Caching Mercado Livre images (mlstatic.com)
          urlPattern: /^https:\/\/http2\.mlstatic\.com\/.*/i,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "ml-images-cache",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: new RegExp("/api/bikes"),
          method: "POST",
          handler: "NetworkOnly",
          options: {
            backgroundSync: {
              // BackgroundSyncPlugin: enables offline bike saving
              name: "bikes-queue",
              options: {
                maxRetentionTime: 24 * 60,
              },
            },
          },
        },
        {
          urlPattern: /\/api\/?.*/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: "classic",
    },
  },
  css: ["~/assets/css/brand.css"],
  runtimeConfig: {
    /** Neon Console → Auth; proxy target for /api/auth/* (see server/api/auth/[...].ts) */
    neonAuthBaseUrl:
      process.env.NUXT_NEON_AUTH_BASE_URL ||
      process.env.NEON_AUTH_BASE_URL ||
      "",
    rateLimitWindowMs: 60_000,
    rateLimitMaxBikesPost: 30,
    rateLimitMaxAdmin: 20,
    rateLimitMaxScrape: 3,
  },
  app: {
    head: {
      title: "Monta Bike",
      meta: [
        {
          name: "description",
          content:
            "Monta Bike (montabike.com) - Simulador completo de montagem de bicicletas MTB.",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap",
        },
      ],
    },
  },
  nitro: {
    storage: {
      cache: {
        driver: "memory",
      },
    },
  },
});
