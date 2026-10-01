<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
  <section class="experience-content py-20" aria-labelledby="experience-heading">
    <div class="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
      <p class="eyebrow">{{ t('motion.experienceKicker') }}</p>
      <h2 id="experience-heading" class="section-title">{{ t('motion.experience') }}</h2>
      <div class="experience-timeline">
        <article><p class="experience-date">2022/06 — 2026/09</p><div><h3>{{ t('motion.employer') }}</h3><p class="experience-role">{{ t('editorial.role') }}</p><ul><li>{{ t('motion.work1') }}</li><li>{{ t('motion.work2') }}</li><li>{{ t('motion.work3') }}</li></ul></div></article>
        <article><p class="experience-date">{{ t('motion.education') }}</p><div><h3>{{ t('motion.school') }}</h3><p>{{ t('motion.degree') }}</p></div></article>
      </div>
    </div>
  </section>
</template>
