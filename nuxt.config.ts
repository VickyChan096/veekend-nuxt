// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    // 如果不是開發環境 (即生產環境)，就使用 /veekend-nuxt/
    baseURL: process.env.NODE_ENV === "production" ? "/veekend-nuxt/" : "/",
  },

  devServer: {
    host: "127.0.0.1",
    port: 9999,
  },
  modules: [
    "@nuxt/a11y",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
  ],
});
