<script lang="ts" setup>
const { data: weeklyPosts } = await useAsyncData('weekly-posts', () => {
  return queryCollection('weekly').order('date', 'DESC').limit(5).all()
})
</script>

<template>
  <div>
    網站首頁
    <NuxtLink v-for="item in weeklyPosts" :key="item.path" :to="item.path">{{ item.title }}</NuxtLink>
  </div>
</template>

<style lang="scss" scoped></style>
