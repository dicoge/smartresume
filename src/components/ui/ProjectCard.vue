<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Project } from '../../types'

defineProps<{
  project: Project
}>()

const { t } = useI18n()
</script>

<template>
  <div data-testid="project-card" class="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 project-card-dark" style="background-color: var(--bg-secondary); border: 1px solid var(--border);">
    <!-- Emoji Header -->
    <div class="h-48 flex items-center justify-center text-7xl" style="background: linear-gradient(135deg, #e76f51, #e9c46a);">
      {{ project.emoji }}
    </div>

    <!-- Content -->
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-1" style="color: var(--text-primary);">
        {{ t(`projects.${project.id}.title`) }}
      </h3>
      <p class="text-sm mb-3" style="color: var(--text-secondary);">
        {{ t(`projects.${project.id}.subtitle`) }}
      </p>
      <p class="text-sm mb-4 leading-relaxed" style="color: var(--text-secondary);">
        {{ t(`projects.${project.id}.description`) }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="dark-chip"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap gap-3 text-sm mb-4" style="color: var(--text-secondary);">
        <span v-for="stat in project.stats" :key="stat">{{ stat }}</span>
      </div>

      <!-- Links -->
      <div class="flex gap-4">
        <a
          v-if="project.github"
          :href="project.github"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold text-sm transition-colors"
          style="color: var(--accent);"
        >
          {{ t('projects.viewCode') }} →
        </a>
        <a
          v-if="project.demo"
          :href="project.demo"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold text-sm transition-colors"
          style="color: var(--accent);"
        >
          {{ t('projects.liveDemo') }} →
        </a>
      </div>
    </div>
  </div>
</template>
