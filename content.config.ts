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

const WeeklyLinkSchema = z.object({
  url: z.string().url(),
  text: z.string(),
  target: z.string().optional(),
})

const WeeklyImageSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
})

const WeeklyInfoSchema = z.object({
  label: z.string(),
  text: z.string().optional(),
  link: WeeklyLinkSchema.optional(),
})

const WeeklySectionStyle1Schema = z.object({
  type: z.literal('articleStyle1'),
  id: z.string().optional(),
  title: z.string().optional(),
  rating: z.union([z.number(), z.string()]).optional(),
  image: WeeklyImageSchema.optional(),
  infos: z.array(WeeklyInfoSchema).optional(),
  bullets: z.array(z.string()).optional(),
})

const WeeklySectionStyle2Schema = z.object({
  type: z.literal('articleStyle2'),
  id: z.string().optional(),
  title: z.string().optional(),
  rating: z.union([z.number(), z.string()]).optional(),
  image: WeeklyImageSchema.optional(),
  infos: z.array(WeeklyInfoSchema).optional(),
  bullets: z.array(z.string()).optional(),
})

const WeeklySectionStyle3Schema = z.object({
  type: z.literal('articleStyle3'),
  id: z.string().optional(),
  noteTitle: z.string().optional(),
  images: z.array(WeeklyImageSchema).optional(),
  bullets: z.array(z.string()).optional(),
})

const WeeklySectionStyle4Schema = z.object({
  type: z.literal('articleStyle4'),
  id: z.string().optional(),
  noteTitle: z.string().optional(),
  image: WeeklyImageSchema.optional(),
  bullets: z.array(z.string()).optional(),
})

const WeeklySectionStyle5Schema = z.object({
  type: z.literal('articleStyle5'),
  id: z.string().optional(),
  cards: z
    .array(
      z.object({
        image: WeeklyImageSchema,
        title: z.string(),
        text: z.string(),
      })
    )
    .optional(),
})

const WeeklySectionStyle6Schema = z.object({
  type: z.literal('articleStyle6'),
  id: z.string().optional(),
  noteTitle: z.string().optional(),
  video: z
    .object({
      youtubeId: z.string(),
      title: z.string().optional(),
    })
    .optional(),
  text: z.string().optional(),
})

const WeeklySectionSchema = z.discriminatedUnion('type', [
  WeeklySectionStyle1Schema,
  WeeklySectionStyle2Schema,
  WeeklySectionStyle3Schema,
  WeeklySectionStyle4Schema,
  WeeklySectionStyle5Schema,
  WeeklySectionStyle6Schema,
])

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
            })
          )
          .optional(),
        catalog: z
          .object({
            title: z.string().optional(),
            items: z
              .array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                })
              )
              .optional(),
          })
          .optional(),
        sections: z.array(WeeklySectionSchema).optional(),
      }),
      indexes: [{ columns: ['date'] }, { columns: ['week'] }, { columns: ['draft'] }],
    }),
  },
})
