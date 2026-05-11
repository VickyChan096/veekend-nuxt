// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    // 如果不是開發環境 (即生產環境)，就使用 /veekend-nuxt/
    baseURL: process.env.NODE_ENV === 'production' ? '/veekend-nuxt/' : '/',
  },
  image: {
    // 【核心修正】
    // 在生產環境下（GitHub Pages），我們不需要也無法使用 ipx 處理器
    // 將其設為 'none' 或 'static' 會讓路徑保持原樣
    provider: process.env.NODE_ENV === 'production' ? 'none' : 'ipx',

    // 確保 alias 不會干擾路徑
    alias: {
      '/images': '/images',
    },
  },

  // 如果你是用 Nuxt Content v3，請確保它不會自動把圖片轉給 NuxtImg
  content: {
    build: {
      markdown: {},
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
