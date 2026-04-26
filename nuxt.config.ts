// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-auth-utils'],
  css: ['~/assets/css/brand.css'],
  app: {
    head: {
      title: 'Monta Bike | Daniel Builds',
      meta: [
        { name: 'description', content: 'Monta Bike (montabike.com) - Simulador completo de montagem de bicicletas MTB by Daniel Builds.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap' }
      ]
    }
  },
  nitro: {
    storage: {
      cache: {
        driver: 'memory'
      }
    }
  }
})
