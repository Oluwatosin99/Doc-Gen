// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // CRITICAL: Disable SSR for local SQLite/Enterprise portal builds 
  // to prevent server-side build conflicts with frontend aliases.
  ssr: false,

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  // Tailwind configuration (moved out of the modules array for clarity)
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  imports: {
    dirs: ['./stores/**']
  },

  ignore: [
    'db/**',
    '**/*.db'
  ], 

  runtimeConfig: {
    dbServer: process.env.DB_SERVER || 'localhost',
    dbName: process.env.DB_NAME || 'Generator',
    dbUser: process.env.DB_USER || 'sa',
    dbPassword: process.env.DB_PASSWORD || 'LocalSqlServer@123',

    public: {
      appTitle: process.env.NUXT_PUBLIC_APP_TITLE,
      appDomain: process.env.NUXT_PUBLIC_APP_DOMAIN,

      authApiBaseUrl: process.env.NUXT_PUBLIC_AUTH_API_BASE_URL,
      corsOrigin: process.env.NUXT_PUBLIC_CORS_ORIGIN
    }
  },
})