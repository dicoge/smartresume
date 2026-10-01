<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from './composables/useTheme'
import { useScrollScenes } from './composables/useScrollScenes'
import EngineeringAtmosphere from './components/layout/EngineeringAtmosphere.vue'
import ScrollScene from './components/layout/ScrollScene.vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import ExperienceSection from './components/sections/ExperienceSection.vue'
import TechStackSection from './components/sections/TechStackSection.vue'
import StatsSection from './components/sections/StatsSection.vue'
import ContactSection from './components/sections/ContactSection.vue'
const { t } = useI18n()
const sceneRoot = ref<HTMLElement | null>(null)
const { activeSceneId, progress, transitionEnergy } = useScrollScenes(sceneRoot)
const chapters = [
  { id: 'home', label: 'motion.home', component: HeroSection },
  { id: 'about', label: 'nav.about', component: AboutSection },
  { id: 'projects', label: 'nav.projects', component: ProjectsSection },
  { id: 'experience', label: 'motion.experience', component: ExperienceSection },
  { id: 'tech', label: 'nav.techStack', component: TechStackSection },
  { id: 'stats', label: 'stats.title', component: StatsSection },
  { id: 'contact', label: 'nav.contact', component: ContactSection },
]
const activeIndex = computed(() => Math.max(0, chapters.findIndex(chapter => chapter.id === activeSceneId.value)))
useTheme()
</script>
<template>
  <div class="portfolio-root">
    <a href="#home" class="skip-link">{{ t('motion.skip') }}</a>
    <EngineeringAtmosphere :energy="transitionEnergy" :progress="progress" />
    <TheHeader />
    <div class="scroll-progress" aria-hidden="true" :style="{ transform: 'scaleX(' + progress + ')' }" />
    <main ref="sceneRoot" class="scene-list">
      <ScrollScene v-for="(chapter, index) in chapters" :key="chapter.id" :id="chapter.id" :index="index + 1" :label="t(chapter.label)">
        <component :is="chapter.component" />
      </ScrollScene>
    </main>
    <nav class="chapter-rail" :aria-label="t('motion.chapters')">
      <a v-for="(chapter, index) in chapters" :key="chapter.id" :href="'#' + chapter.id" :aria-label="t(chapter.label)" :aria-current="activeSceneId === chapter.id ? 'location' : undefined"><span>{{ String(index + 1).padStart(2, '0') }}</span><span class="chapter-tooltip">{{ t(chapter.label) }}</span></a>
    </nav>
    <nav class="mobile-chapters" :aria-label="t('motion.chapters')">
      <a :href="'#' + chapters[Math.max(0, activeIndex - 1)].id" :aria-label="t('motion.previous')">↑</a>
      <span>{{ String(activeIndex + 1).padStart(2, '0') }} / 07 <b>{{ t(chapters[activeIndex].label) }}</b></span>
      <a :href="'#' + chapters[Math.min(chapters.length - 1, activeIndex + 1)].id" :aria-label="t('motion.next')">↓</a>
    </nav>
    <TheFooter />
  </div>
</template>
