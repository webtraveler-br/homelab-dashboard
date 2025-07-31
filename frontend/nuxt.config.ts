// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://backend:8000/api', // Endereço do backend Laravel
        changeOrigin: true,
        prependPath: true,
      }
    }
  }
})