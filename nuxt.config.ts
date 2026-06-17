// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
   vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
      ]
    }
  },
  modules: ['@pinia/nuxt'],
  devtools: { enabled: true }
})
