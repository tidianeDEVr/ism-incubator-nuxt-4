// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  // @ts-expect-error - Types are generated after nuxt prepare
  googleFonts: {
    families: {
      Montserrat: [300, 400, 500, 600, 700],
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },

  typescript: {
    strict: true,
  },

  components: [
    { path: '~/components/ui', pathPrefix: false },
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/components/common', pathPrefix: false },
    { path: '~/components/home', pathPrefix: false },
    { path: '~/components/admin', pathPrefix: false },
    { path: '~/components/dashboard', pathPrefix: false },
  ],

  app: {
    head: {
      title: 'ISM Incubator - Hackathon Platform',
      meta: [
        { name: 'description', content: 'Plateforme digitale de hackathons et d\'incubation de l\'ISM Dakar' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      appName: 'ISM Incubator',
    },
  },
})
