// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: false, // Desativa SSR
  nitro: {
    preset: "static", // Gera arquivos estáticos
    static: true,
  },
  vite: {
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "firebase/app",
        "firebase/auth",
        "firebase/firestore",
        "v-money3",
        "vue-chrts",
        "vuedraggable",
        "zod",
      ],
    },
  },
  routeRules: {
    "/login": { appLayout: "auth" },
  },
  modules: ["@pinia/nuxt", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: "",
  },
  devtools: { enabled: true },
});
