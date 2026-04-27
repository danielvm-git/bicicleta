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
      theme_color: "#0d6b6b",
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
  css: ["~/assets/css/brand.css", "~/assets/css/themes.css"],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              50: "#f0f8f7",
              100: "#ddf1f0",
              200: "#b9e4e1",
              300: "#8ed4cf",
              400: "#5ebdb6",
              500: "#0d6b6b",
              600: "#0a5555",
              700: "#084545",
              800: "#063939",
              900: "#052e2e",
              950: "#021a1a",
            },
            gray: {
              50: "#fafaf9",
              100: "#f5f5f4",
              200: "#e7e5e4",
              300: "#d6d3d1",
              400: "#a8a29e",
              500: "#78716b",
              600: "#57534e",
              700: "#44403c",
              800: "#292524",
              900: "#1c1917",
              950: "#0c0a09",
            },
          },
          fontFamily: {
            display: [
              '"Bricolage Grotesque"',
              "ui-sans-serif",
              "system-ui",
              "sans-serif",
            ],
            body: ['"Source Serif 4"', "Georgia", '"Times New Roman"', "serif"],
          },
        },
      },
    },
  },
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
