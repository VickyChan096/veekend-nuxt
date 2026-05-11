import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const BaseFrontmatterSchema = z.object({
  /**
   * Nuxt Content 的 frontmatter `date` 常見會寫成字串（YYYY-MM-DD）。
   * 這裡用 coerce 讓查詢/排序時能用真正的 Date。
   */
  date: z.coerce.date(),
  description: z.string().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  navigation: z.boolean().optional(),
})

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: BaseFrontmatterSchema.extend({
        // blog 額外擴充欄位可以放這裡（例如作者、封面等）
        cover: z
          .object({
            src: z.string(),
            alt: z.string().optional(),
          })
          .optional(),
      }),
      indexes: [{ columns: ['date'] }, { columns: ['draft'] }],
    }),

    // 主題一：54週週記
    weekly: defineCollection({
      type: 'page',
      source: 'weekly/*.md', // 對應 content/weekly/ 內容
      schema: BaseFrontmatterSchema.extend({
        // 紀錄是第幾週，方便排序（先做成 optional，避免舊文章缺欄位就報錯）
        week: z.number().optional(),
        userName: z.string().optional(),
        visitedDate: z.coerce.date().optional(),
        writtenDate: z.coerce.date().optional(),
        briefing: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        hashTags: z.array(z.string()).optional(),
        cover: z
          .object({
            large: z.string(),
            small: z.string().optional(),
          })
          .optional(),
        destinations: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              rate: z.number().optional(),
              mapUrl: z.string().url().optional(),
              local: z.tuple([z.number(), z.number()]).optional(),
              cover: z
                .object({
                  src: z.string(),
                  alt: z.string().optional(),
                })
                .optional(),
            }),
          )
          .optional(),
        sections: z
          .array(
            z.object({
              title: z.string(),
              rank: z.number().optional(),
              date: z.coerce.date().optional(),
              address: z.string().optional(),
              x: z.number().optional(),
              y: z.number().optional(),
              description: z.string().optional(),
            }),
          )
          .optional(),
      }),
      indexes: [{ columns: ['date'] }, { columns: ['week'] }, { columns: ['draft'] }],
    }),
  },
})
