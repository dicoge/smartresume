<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { techCategories } from '../../data/techStack'
import { useScrollReveal } from '../../composables/useScrollReveal'

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
useScrollReveal(sectionRef)

const categoryTitleMap: Record<string, string> = {
  languages: 'techStack.languages',
  frameworks: 'techStack.frameworks',
  ai_stack: 'techStack.ai_stack',
  specializations: 'techStack.specializations',
}
</script>

<template>
  <section ref="sectionRef" id="tech" class="py-20" style="background-color: var(--bg-primary);">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('techStack.title') }}</h2>
      <p class="section-subtitle">{{ t('techStack.subtitle') }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div
          v-for="category in techCategories"
          :key="category.id"
          class="p-6 rounded-2xl transition-all duration-300"
          style="background-color: var(--bg-secondary); border: 1px solid var(--border);"
        >
          <h3 class="font-semibold mb-4 flex items-center gap-2" style="color: var(--accent);">
            <span>{{ category.icon }}</span>
            {{ t(categoryTitleMap[category.id]) }}
          </h3>
          <ul class="space-y-2">
            <li
              v-for="item in category.items"
              :key="item"
              class="text-sm flex items-center gap-2"
              style="color: var(--text-secondary);"
            >
              <span style="color: var(--accent); font-weight: bold;">▹</span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
