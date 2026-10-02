<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import KineticCore from '../ui/KineticCore.vue'
import { projects } from '../../data/projects'
const { t, locale } = useI18n()
const featured = projects.find(project => project.id === 'midnightPassport')!
const resumePdfLink = computed(() => import.meta.env.BASE_URL + (locale.value === 'en' ? 'resume_en.pdf' : 'resume_zh.pdf'))
const cover = import.meta.env.BASE_URL + 'projects/midnightPassport.webp'
</script>

<template>
  <section class="portfolio-hero" aria-labelledby="hero-name">
    <div class="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
      <p class="eyebrow"><span aria-hidden="true">&lt;/&gt;</span> {{ t('editorial.eyebrow') }}</p>
      <div class="hero-intro">
        <div>
          <h1 id="hero-name" class="hero-name">{{ t('hero.name') }}</h1>
          <p class="hero-role">{{ t('editorial.role') }}</p>
          <p class="hero-focus">Unity / C# <span aria-hidden="true">·</span> {{ t('editorial.web') }}</p>
        </div>
        <div class="hero-context">
          <KineticCore />
          <p class="eyebrow">IGS / 2022.06 — 2026.09</p>
          <p>{{ t('editorial.intro') }}</p>
        </div>
      </div>
      <div class="hero-actions">
        <a href="#projects" class="btn-primary">{{ t('hero.viewProjects') }} <span aria-hidden="true">↘</span></a>
        <a :href="resumePdfLink" target="_blank" rel="noopener noreferrer" class="btn-secondary">{{ t('hero.downloadResume') }} <span aria-hidden="true">↓</span></a>
        <a href="#contact" class="text-link">{{ t('hero.contactMe') }} <span aria-hidden="true">↗</span></a>
      </div>
      <a href="#projects" class="featured-stage" :aria-label="t('projects.midnightPassport.title') + ' — ' + t('hero.viewProjects')">
        <div class="featured-copy">
          <p class="eyebrow">{{ t('editorial.personal') }} / 01</p>
          <h2>{{ t('projects.midnightPassport.title') }}</h2>
          <p>{{ t('projects.midnightPassport.subtitle') }}</p>
          <p class="featured-tech">{{ featured.tags.join(' / ') }}</p>
          <span class="featured-link">{{ t('editorial.explore') }} ↗</span>
        </div>
        <figure class="featured-image">
          <img :src="cover" :alt="t('projects.midnightPassport.title') + ' — ' + t('editorial.gameCover')" width="1672" height="941" fetchpriority="high" />
          <figcaption>{{ t('editorial.gameCover') }}</figcaption>
        </figure>
      </a>
      <p class="scroll-cue">{{ t('motion.scroll') }} <span aria-hidden="true">↓</span></p>
      <div class="expertise-strip" aria-label="Technologies">
        <span><b>01</b> Unity & C#</span><span><b>02</b> Vue.js & Node.js</span><span><b>03</b> Expo & React Native</span>
      </div>
    </div>
  </section>
</template>
