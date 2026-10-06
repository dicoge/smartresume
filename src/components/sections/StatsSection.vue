<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { githubStats } from '../../data/stats'

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
</script>

<template>
  <section ref="sectionRef" class="py-20" style="background-color: var(--bg-secondary);">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('stats.title') }}</h2>
      <p class="section-subtitle">{{ t('stats.subtitle') }}</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-8">
        <div
          v-for="stat in githubStats"
          :key="stat.id"
          class="px-2.5 py-4 sm:p-6 rounded-2xl text-center transition-all duration-300"
          style="background-color: var(--bg-secondary); border: 1px solid var(--border);"
        >
          <div class="text-[1.625rem] lg:text-4xl font-extrabold gradient-text mb-2">
            {{ stat.value }}
          </div>
          <div class="text-xs sm:text-sm" style="color: var(--text-secondary);">
            {{ t(`stats.${stat.id}`) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
