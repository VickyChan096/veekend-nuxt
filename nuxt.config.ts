// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    // 如果不是開發環境 (即生產環境)，就使用 /veekend-nuxt/
    baseURL: process.env.NODE_ENV === 'production' ? '/veekend-nuxt/' : '/',
  },
  image: {
    // 解決關鍵：將 provider 設定為 static，或者修正 IPX 的處理路徑
    provider: 'ipx',
    ipx: {
      // 確保在生產環境下，IPX 的請求路徑是正確的
      // 這邊通常應該是指向根路徑下的 _ipx 處理器
      baseURL: process.env.NODE_ENV === 'production' ? '/veekend-nuxt/_ipx' : '/_ipx',
    },
  },
  nitro: {
    prerender: {
      // 建議開啟這個，避免因為幾張圖片抓不到就讓整個 Action 報銷
      failOnError: false,
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 9999,
  },
  // content: {
  //   build: {
  //     markdown: {
  //       toc: {
  //         depth: 3,
  //         searchDepth: 3,
  //       },
  //       highlight: {
  //         theme: {
  //           default: 'github-light',
  //           dark: 'github-dark',
  //         },
  //         langs: [
  //           'json',
  //           'js',
  //           'ts',
  //           'html',
  //           'css',
  //           'vue',
  //           'shell',
  //           'md',
  //           'mdc',
  //           'yaml',
  //           'bash',
  //           'scss',
  //           'sql',
  //         ],
  //       },
  //     },
  //     pathMeta: {
  //       forceLeadingSlash: true,
  //     },
  //   },
  //   renderer: {
  //     anchorLinks: { h2: true, h3: true, h4: true },
  //   },
  //   watch: {
  //     enabled: true,
  //   },
  // },
  css: ['@/assets/scss/main.scss'],
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/preprocess.scss" as *;',
        },
      },
    },
  },
  modules: ['@nuxt/a11y', '@nuxt/content', '@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image'],
})
