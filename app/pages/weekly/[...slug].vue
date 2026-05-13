<script lang="ts" setup>
type WeeklyLink = {
  url: string
  text: string
  target?: string
}

type WeeklyInfo = {
  label: string
  text?: string
  link?: WeeklyLink
}

type WeeklyImage = { src: string; alt?: string }

type WeeklySectionStyle1 = {
  type: 'articleStyle1'
  id?: string
  title?: string
  rating?: number | string
  image?: WeeklyImage
  infos?: WeeklyInfo[]
  bullets?: string[]
}

type WeeklySectionStyle2 = {
  type: 'articleStyle2'
  id?: string
  title?: string
  rating?: number | string
  image?: WeeklyImage
  infos?: WeeklyInfo[]
  bullets?: string[]
}

type WeeklySectionStyle3 = {
  type: 'articleStyle3'
  id?: string
  images?: WeeklyImage[]
  noteTitle?: string
  bullets?: string[]
}

type WeeklySectionStyle4 = {
  type: 'articleStyle4'
  id?: string
  noteTitle?: string
  bullets?: string[]
  image?: WeeklyImage
}

type WeeklySectionStyle5 = {
  type: 'articleStyle5'
  id?: string
  cards?: Array<{ image: WeeklyImage; title: string; text: string }>
}

type WeeklySectionStyle6 = {
  type: 'articleStyle6'
  id?: string
  noteTitle?: string
  video?: { youtubeId: string; title?: string }
  text?: string
}

type WeeklySection =
  | WeeklySectionStyle1
  | WeeklySectionStyle2
  | WeeklySectionStyle3
  | WeeklySectionStyle4
  | WeeklySectionStyle5
  | WeeklySectionStyle6

type WeeklyCatalogItem = {
  id: string
  title: string
}

type WeeklySectionWithCatalogAnchor = (WeeklySectionStyle1 | WeeklySectionStyle2) & {
  id: string
  title: string
}

type WeeklyDocument = {
  title: string
  description?: string
  catalog?: {
    title?: string
    items?: WeeklyCatalogItem[]
  }
  sections?: WeeklySection[]
}

const route = useRoute()
const { data, pending } = await useAsyncData<WeeklyDocument | null>(route.path, async () => {
  const result = await queryCollection('weekly').path(route.path).first()
  return result as WeeklyDocument | null
})

const isWeeklyCatalogItem = (item: unknown): item is WeeklyCatalogItem => {
  if (!item || typeof item !== 'object') return false
  const candidate = item as Record<string, unknown>
  return typeof candidate.id === 'string' && typeof candidate.title === 'string'
}

const hasCatalogAnchor = (section: WeeklySection): section is WeeklySectionWithCatalogAnchor => {
  if (section.type !== 'articleStyle1' && section.type !== 'articleStyle2') return false

  return (
    typeof section.id === 'string' &&
    section.id.length > 0 &&
    typeof section.title === 'string' &&
    section.title.length > 0
  )
}

const hasStructuredSections = computed(() => Array.isArray(data.value?.sections) && data.value.sections.length > 0)

const catalogItems = computed<WeeklyCatalogItem[]>(() => {
  if (!data.value) return []

  if (Array.isArray(data.value.catalog?.items) && data.value.catalog.items.length > 0) {
    return data.value.catalog.items.filter(isWeeklyCatalogItem)
  }

  return (data.value.sections ?? [])
    .filter(hasCatalogAnchor)
    .map((section) => ({ id: section.id, title: section.title }))
})

const sections = computed<WeeklySection[]>(() => {
  return data.value?.sections ?? []
})

const sectionClass = (section: WeeklySection) => section.type

const normalizedPath = computed(() => {
  const raw = route.params.slug
  const segments = (Array.isArray(raw) ? raw : [raw])
    .filter(Boolean)
    .map((segment) => String(segment).trim())
    .filter((segment) => segment.length > 0 && segment !== 'weekly')

  const leaf = segments.at(-1)?.replace(/\.md$/i, '')
  return leaf ? `/weekly/${leaf}` : '/weekly'
})

const shouldRedirect = computed(() => route.path !== normalizedPath.value)

// const { data, pending } = await useAsyncData(
//   () => `weekly-doc:${normalizedPath.value}`,
//   () => queryCollection('weekly').path(normalizedPath.value).first(),
//   {
//     watch: [normalizedPath],
//   }
// )

watchEffect(() => {
  if (shouldRedirect.value) {
    navigateTo(normalizedPath.value, { replace: true })
  }
})
</script>

<template>
  <section v-if="!shouldRedirect">
    <p v-if="pending">載入中...</p>

    <article v-else-if="data" class="weekly-post">
      <h1 class="weekly-post__title">{{ data.title }}</h1>
      <p v-if="data.description" class="weekly-post__desc">{{ data.description }}</p>

      <template v-if="hasStructuredSections">
        <div v-if="catalogItems.length > 0" class="article__middle__catalog">
          <p>{{ data.catalog?.title || '本週景點' }}</p>
          <div class="catalogBtn" aria-hidden="true">✕</div>
          <div class="catalogDest">
            <a v-for="item in catalogItems" :key="item.id" :href="`#${item.id}`">{{ item.title }}</a>
          </div>
        </div>

        <section
          v-for="(section, index) in sections"
          :id="section.id"
          :key="`${section.type}-${section.id || index}`"
          :class="sectionClass(section)"
        >
          <template v-if="section.type === 'articleStyle1' || section.type === 'articleStyle2'">
            <img v-if="section.image" :src="section.image.src" :alt="section.image.alt || section.title || ''" />

            <div>
              <h4 v-if="section.title">{{ section.title }}</h4>
              <h6 v-if="section.rating">個人評分：{{ section.rating }}</h6>
              <ul v-if="section.infos?.length">
                <li v-for="(info, infoIndex) in section.infos" :key="`info-${infoIndex}`">
                  <template v-if="info.link">
                    {{ info.label }}：
                    <a :href="info.link.url" :target="info.link.target || '_blank'">{{ info.link.text }}</a>
                  </template>
                  <template v-else> {{ info.label }}：{{ info.text }} </template>
                </li>
              </ul>
              <ul v-if="section.bullets?.length">
                <li v-for="(bullet, bulletIndex) in section.bullets" :key="`bullet-${bulletIndex}`">{{ bullet }}</li>
              </ul>
            </div>
          </template>

          <template v-else-if="section.type === 'articleStyle3'">
            <img
              v-for="(image, imageIndex) in section.images"
              :key="`image-${imageIndex}`"
              :src="image.src"
              :alt="image.alt || section.noteTitle || ''"
            />
            <div>
              <h5 v-if="section.noteTitle">{{ section.noteTitle }}</h5>
              <ul v-if="section.bullets?.length">
                <li v-for="(bullet, bulletIndex) in section.bullets" :key="`bullet-${bulletIndex}`">{{ bullet }}</li>
              </ul>
            </div>
          </template>

          <template v-else-if="section.type === 'articleStyle4'">
            <div>
              <h5 v-if="section.noteTitle">{{ section.noteTitle }}</h5>
              <ul v-if="section.bullets?.length">
                <li v-for="(bullet, bulletIndex) in section.bullets" :key="`bullet-${bulletIndex}`">{{ bullet }}</li>
              </ul>
            </div>
            <img v-if="section.image" :src="section.image.src" :alt="section.image.alt || section.noteTitle || ''" />
          </template>

          <template v-else-if="section.type === 'articleStyle5'">
            <div v-for="(card, cardIndex) in section.cards" :key="`card-${cardIndex}`" class="articleStyle5__oneThird">
              <img :src="card.image.src" :alt="card.image.alt || card.title" />
              <h5>{{ card.title }}</h5>
              <p>{{ card.text }}</p>
            </div>
          </template>

          <template v-else-if="section.type === 'articleStyle6'">
            <h5 v-if="section.noteTitle">{{ section.noteTitle }}</h5>
            <iframe
              v-if="section.video?.youtubeId"
              :src="`https://www.youtube.com/embed/${section.video.youtubeId}`"
              :title="section.video.title || section.noteTitle || 'YouTube video player'"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <p v-if="section.text">{{ section.text }}</p>
          </template>
        </section>
      </template>

      <ContentRenderer v-else :value="data" />
    </article>

    <p v-else>找不到這篇文章，請確認網址是否正確。</p>
  </section>
</template>

<style lang="scss" scoped>
.weekly-post {
  width: 100%;
}

.article__middle__catalog {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px;
  width: 100%;
  border: 1px solid var(--divider);
  border-radius: var(--border-radius-s);

  p {
    font-size: 1.125rem;
    font-weight: 700;
  }
}

.catalogBtn {
  color: var(--divider);
  font-size: 1.125rem;
  user-select: none;
}

.catalogDest {
  width: 100%;
  line-height: 2;
}

.catalogDest a {
  display: block;
  padding: 0 4px;
  color: var(--secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: var(--transition-fast);

  &:hover {
    border-radius: var(--border-radius-s);
    background-color: var(--divider);
  }

  &::before {
    content: '• ';
  }
}

.articleStyle1,
.articleStyle2,
.articleStyle3,
.articleStyle4,
.articleStyle5,
.articleStyle6 {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--divider);

  img {
    border-radius: var(--border-radius-s);
  }

  h4 {
    position: relative;
    margin-bottom: 10px;
    padding-left: 1.5rem;
    font-size: 1.125rem;
    font-weight: 700;

    &::before {
      content: '•';
      position: absolute;
      top: 0;
      left: 0;
      color: var(--secondary);
      font-size: 1.25rem;
      line-height: 1;
    }
  }

  h5 {
    margin-bottom: 10px;
    font-weight: 700;
  }

  h6 {
    position: relative;
    display: inline-block;
    margin-bottom: 10px;
    text-decoration: underline;
    text-decoration-color: var(--secondary);
    text-decoration-thickness: 8px;
    text-underline-offset: -4px;
    text-decoration-skip-ink: none;

    &::before {
      content: '[註]';
      position: absolute;
      right: -25px;
      color: var(--subtitle);
      font-size: 0.7rem;
    }

    &:hover::after {
      content: '滿分5分';
      position: absolute;
      top: 18px;
      right: -45px;
      padding: 4px;
      width: 60px;
      text-align: center;
      color: #fff;
      font-size: 0.7rem;
      border-radius: 4px;
      background: rgb(0 0 0 / 60%);
    }
  }

  li {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: var(--secondary);
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
}

.articleStyle1,
.articleStyle2 {
  display: flex;
  justify-content: space-between;

  img {
    width: 50%;
    max-height: 300px;
    object-fit: cover;
  }

  > div {
    width: 50%;
  }
}

.articleStyle3 img,
.articleStyle4 img,
.articleStyle5 img {
  width: 100%;
  height: auto;
}

.articleStyle1 > div {
  padding-left: 20px;
}

.articleStyle2 {
  > div {
    padding-right: 20px;
  }
}

.articleStyle3 {
  img {
    margin-bottom: 10px;
  }
}

.articleStyle4 {
  img {
    margin-bottom: 10px;
  }

  li {
    margin-bottom: 10px !important;
  }
}

.articleStyle5 {
  display: flex;
  justify-content: space-between;
  text-align: center;

  &__oneThird {
    width: 32%;

    img {
      margin-bottom: 8px;
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    h5 {
      margin-bottom: 0 !important;
    }
  }
}

.articleStyle6 iframe {
  width: 100%;
  height: 350px;
  border: 0;
  border-radius: var(--border-radius-s);
}

@media (min-width: 768px) {
  .article__middle__catalog {
    width: 300px;
  }
}

@media (max-width: 767px) {
  .articleStyle1,
  .articleStyle2 {
    flex-wrap: wrap;

    img,
    > div {
      width: 100%;
    }

    img {
      margin-bottom: 10px;
      max-height: none;
    }
  }

  .articleStyle1 > div,
  .articleStyle2 > div {
    padding: 0;
  }

  .articleStyle2 {
    flex-direction: column-reverse;
  }

  .articleStyle4 {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column-reverse;

    li {
      margin-bottom: 0 !important;
    }
  }

  .articleStyle5 {
    justify-content: center;
    flex-wrap: wrap;

    &__oneThird {
      width: 80%;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      img {
        height: auto;
      }
    }
  }
}

.weekly-post__title {
  margin: 0 0 0.5rem;
}

.weekly-post__desc {
  margin: 0 0 1rem;
  color: var(--subtitle);
}

.weekly-post__empty {
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  border-left: 4px solid rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.03);
}
</style>
