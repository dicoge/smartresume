<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Project } from '../../types'
import ProjectVisual from './ProjectVisual.vue'
defineProps<{ project: Project; index?: number }>()
const { t } = useI18n()
</script>
<template>
  <article data-testid="project-card" class="portfolio-project" :id="'project-' + project.id">
    <ProjectVisual :project-id="project.id" />
    <div class="project-content">
      <div class="project-title-row"><span v-if="index !== undefined" class="project-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span><h3>{{ t('projects.' + project.id + '.title') }}</h3></div>
      <p class="project-subtitle">{{ t('projects.' + project.id + '.subtitle') }}</p>
      <p class="project-description">{{ t('projects.' + project.id + '.description') }}</p>
      <ul class="project-tags" :aria-label="t('nav.techStack')"><li v-for="tag in project.tags" :key="tag" class="dark-chip">{{ tag }}</li></ul>
      <div class="project-links">
        <a v-if="project.github" :href="project.github" target="_blank" rel="noopener noreferrer" :aria-label="t('projects.' + project.id + '.title') + ' — ' + t('projects.viewCode')">{{ t('projects.viewCode') }} ↗</a>
        <a v-if="project.demo && !project.demoUnavailable" :href="project.demo" target="_blank" rel="noopener noreferrer" :aria-label="t('projects.' + project.id + '.title') + ' — ' + t('projects.liveDemo')">{{ t('projects.liveDemo') }} ↗</a>
        <span v-if="project.demoUnavailable" class="demo-unavailable">{{ t('editorial.demoUnavailable') }}</span>
      </div>
    </div>
  </article>
</template>
