<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { githubStats } from '../../data/stats'
import { useScrollReveal } from '../../composables/useScrollReveal'

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
useScrollReveal(sectionRef)
</script>

<template>
  <section ref="sectionRef" class="py-20" style="background-color: var(--bg-secondary);">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('stats.title') }}</h2>
      <p class="section-subtitle">{{ t('stats.subtitle') }}</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <div
          v-for="stat in githubStats"
          :key="stat.id"
          class="p-6 rounded-2xl text-center transition-all duration-300"
          style="background-color: var(--bg-secondary); border: 1px solid var(--border);"
        >
          <div class="text-4xl font-extrabold gradient-text mb-2">
            {{ stat.value }}
          </div>
          <div class="text-sm" style="color: var(--text-secondary);">
            {{ t(`stats.${stat.id}`) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
