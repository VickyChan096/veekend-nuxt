<script lang="ts" setup>
type WeeklyDestination = {
  id: string
  name: string
  rate?: number
  mapUrl?: string
  local?: [number, number]
  cover?: {
    src: string
    alt?: string
  }
}

// 獨立抓取週記
const { data: weeklyPosts } = await useAsyncData('weekly-posts', () => {
  return queryCollection('weekly').order('date', 'DESC').limit(5).all()
})

// 獨立抓取部落格
const { data: blogPosts } = await useAsyncData('blog-posts', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})
</script>

<template>
  <div>
    <!-- 週記區塊 -->
    <section v-if="weeklyPosts?.length" class="weekly-section">
      <h3>54 週挑戰</h3>
      <ul>
        <li v-for="item in weeklyPosts" :key="item.path">
          <article class="post">
            <header class="post__head">
              <NuxtLink class="post__cover" :to="item.path">
                <NuxtImg
                  v-if="item.cover?.small || item.cover?.large"
                  :src="item.cover?.small || item.cover?.large"
                  :alt="item.title || ''"
                  width="800"
                  height="420"
                  format="webp"
                />
              </NuxtLink>

              <div class="post__headText">
                <h2 class="post__title">
                  <NuxtLink :to="item.path">{{ item.title }}</NuxtLink>
                </h2>

                <p v-if="item.briefing || item.description" class="post__desc">
                  {{ item.briefing || item.description }}
                </p>

                <p class="post__meta">
                  <span v-if="item.city || item.district" class="post__metaItem">
                    {{ [item.city, item.district].filter(Boolean).join('・') }}
                  </span>
                  <span v-if="item.visitedDate" class="post__metaItem">
                    去訪：<time :datetime="String(item.visitedDate)">{{ item.visitedDate }}</time>
                  </span>
                  <span v-if="item.writtenDate || item.date" class="post__metaItem">
                    紀錄：<time :datetime="String(item.writtenDate || item.date)">{{
                      item.writtenDate || item.date
                    }}</time>
                  </span>
                </p>

                <div v-if="item.hashTags?.length" class="post__tags">
                  <span v-for="tag in item.hashTags" :key="tag" class="post__tag">#{{ tag }}</span>
                </div>
              </div>
            </header>

            <nav v-if="item.destinations?.length" class="post__catalog" aria-label="本週景點">
              <div class="post__catalogTitle">本週景點</div>
              <div class="post__catalogLinks">
                <NuxtLink
                  v-for="d in item.destinations"
                  :key="d.id"
                  class="post__catalogLink"
                  :to="`${item.path}#${d.id}`"
                >
                  <span class="post__catalogName">{{ d.name }}</span>
                  <span v-if="typeof d.rate === 'number'" class="post__catalogRate">{{ d.rate }}</span>
                </NuxtLink>
              </div>
            </nav>

            <ContentRenderer :value="item" class="post__content" />
          </article>
        </li>
      </ul>
    </section>

    <hr />

    <!-- 原有的部落格文章區塊 -->
    <section v-if="blogPosts?.length" class="posts">
      <article v-for="post in blogPosts" :key="post.path" class="post">
        <header class="post__head">
          <h2 class="post__title">
            <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
          </h2>
          <p v-if="post.description" class="post__desc">{{ post.description }}</p>
          <p v-if="post.date" class="post__meta">
            <time :datetime="String(post.date)">{{ post.date }}</time>
          </p>
        </header>

        <ContentRenderer :value="post" class="post__content" />
      </article>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.weekly-section > ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 2rem;
}

.post {
  padding: 0;
}

.post__head {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1rem;
  align-items: start;
}

.post__cover {
  display: block;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.02);
}

.post__cover :deep(img) {
  display: block;
  width: 100%;
  height: auto;
}

.post__headText {
  min-width: 0;
}

.post__title {
  margin: 0 0 0.35rem;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--title);
}

.post__title :deep(a) {
  color: inherit;
  text-decoration: none;
}

.post__title :deep(a:hover) {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.post__desc {
  margin: 0 0 0.5rem;
  color: var(--subtitle);
  font-size: 0.95rem;
  line-height: 1.75;
}

.post__meta {
  margin: 0 0 0.6rem;
  font-size: 0.85rem;
  color: var(--placeholder);
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
}

.post__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.post__tag {
  font-size: 0.8rem;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  color: var(--subtitle);
}

.post__catalog {
  margin: 0.9rem 0 1rem;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.02);
}

.post__catalogTitle {
  font-weight: 800;
  color: var(--title);
  margin: 0 0 0.5rem;
}

.post__catalogLinks {
  display: grid;
  gap: 0.4rem;
}

.post__catalogLink {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.45rem 0.6rem;
  border-radius: 10px;
  text-decoration: none;
  color: var(--font);
}

.post__catalogLink:hover {
  background: rgba(0, 0, 0, 0.05);
}

.post__catalogName {
  font-weight: 700;
  color: var(--title);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post__catalogRate {
  font-variant-numeric: tabular-nums;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  color: var(--subtitle);
}

/* ContentRenderer 文章排版 */
.post__content {
  margin-top: 0.5rem;

  :deep(p) {
    margin: 0.75rem 0;
    line-height: 1.9;
  }

  :deep(h2) {
    margin: 1.5rem 0 0.75rem;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--title);
  }

  :deep(h3) {
    margin: 1.25rem 0 0.5rem;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--title);
  }

  :deep(ul),
  :deep(ol) {
    margin: 0.75rem 0;
    padding-left: 1.25rem;
  }

  :deep(li) {
    margin: 0.35rem 0;
    line-height: 1.8;
  }

  :deep(a) {
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  :deep(pre) {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 12px;
    overflow: auto;
    background: rgba(0, 0, 0, 0.06);
  }

  :deep(img) {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 1rem 0;
  }
}

@media (max-width: 720px) {
  .post__head {
    grid-template-columns: 1fr;
  }
}
</style>
