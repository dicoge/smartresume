<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { skillBars } from '../../data/skills'
import { useScrollReveal } from '../../composables/useScrollReveal'

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
useScrollReveal(sectionRef)
const skillsVisible = ref(false)
const skillsRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        skillsVisible.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (skillsRef.value) {
    observer.observe(skillsRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <section ref="sectionRef" id="about" class="py-20" style="background-color: var(--bg-primary);">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('about.title') }}</h2>
      <p class="section-subtitle">{{ t('about.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <!-- What I Do -->
        <div class="p-8 rounded-2xl" style="background-color: var(--bg-secondary); border: 1px solid var(--border);">
          <h3 class="font-semibold text-lg mb-4 flex items-center gap-2" style="color: var(--accent);">
            🎯 {{ t('about.whatIDo') }}
          </h3>
          <p class="leading-relaxed mb-4" style="color: var(--text-secondary);">
            {{ t('about.whatIDoContent') }}
          </p>
          <p class="font-semibold mb-2" style="color: var(--accent);">{{ t('about.currentFocus') }}</p>
          <ul class="space-y-1" style="color: var(--text-secondary);">
            <li>• {{ t('about.focus1') }}</li>
            <li>• {{ t('about.focus2') }}</li>
            <li>• {{ t('about.focus3') }}</li>
          </ul>
        </div>

        <!-- Skills -->
        <div ref="skillsRef" class="p-8 rounded-2xl" style="background-color: var(--bg-secondary); border: 1px solid var(--border);">
          <h3 class="font-semibold text-lg mb-4 flex items-center gap-2" style="color: var(--accent);">
            💻 {{ t('about.skillsTitle') }}
          </h3>
          <div
            v-for="skill in skillBars"
            :key="skill.name"
            class="mb-4 last:mb-0"
          >
            <div class="flex justify-between mb-1 text-sm">
              <span style="color: var(--text-primary); font-weight: 500;">{{ skill.name }}</span>
              <span style="color: var(--text-secondary);">{{ skill.percentage }}%</span>
            </div>
            <div class="h-2 rounded-full overflow-hidden" style="background-color: var(--border);">
              <div
                class="h-full rounded-full transition-all duration-1000 ease-out"
                style="background: linear-gradient(90deg, var(--accent), #818cf8)"
                :style="{ width: skillsVisible ? `${skill.percentage}%` : '0%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
