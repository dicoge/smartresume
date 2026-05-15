<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useTheme } from './composables/useTheme'

// Above the fold — eager load
import TheHeader from './components/layout/TheHeader.vue'
import HeroSection from './components/sections/HeroSection.vue'

// Skeleton loading variants — reusable placeholder with elegant shimmer
const SkeletonWithTitle = {
  data: () => ({ lines: 5 }),
  template: `
    <div class="mx-4 my-8 sm:mx-6 lg:mx-8 py-20">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-center mb-12">
          <div class="h-8 w-48 skeleton-shimmer rounded-lg"></div>
        </div>
        <div class="space-y-4 max-w-3xl mx-auto">
          <div v-for="i in lines" :key="i" class="h-4 skeleton-shimmer rounded-lg" :style="{ width: (55 + Math.random() * 35) + '%' }"></div>
        </div>
      </div>
    </div>
  `,
}
const SkeletonWithCards = {
  template: `
    <div class="mx-4 my-8 sm:mx-6 lg:mx-8 py-20">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-center mb-12">
          <div class="h-8 w-48 skeleton-shimmer rounded-lg"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="rounded-2xl overflow-hidden border border-primary-100/20 dark:border-dark-border/20">
            <div class="h-48 skeleton-shimmer"></div>
            <div class="p-6 space-y-3">
              <div class="h-5 w-3/4 skeleton-shimmer rounded-lg"></div>
              <div class="h-4 w-1/2 skeleton-shimmer rounded-lg"></div>
              <div class="h-4 w-full skeleton-shimmer rounded-lg"></div>
              <div class="h-4 w-5/6 skeleton-shimmer rounded-lg"></div>
              <div class="flex gap-2 pt-2">
                <div class="h-6 w-16 skeleton-shimmer rounded-full"></div>
                <div class="h-6 w-20 skeleton-shimmer rounded-full"></div>
                <div class="h-6 w-14 skeleton-shimmer rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
}
const SkeletonGrid = {
  data: () => ({ columns: 4 }),
  template: `
    <div class="mx-4 my-8 sm:mx-6 lg:mx-8 py-20">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-center mb-12">
          <div class="h-8 w-48 skeleton-shimmer rounded-lg"></div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="i in columns" :key="i" class="p-6 rounded-2xl border border-primary-100/20 dark:border-dark-border/20">
            <div class="h-10 w-20 skeleton-shimmer rounded-lg mx-auto mb-3"></div>
            <div class="h-4 w-24 skeleton-shimmer rounded-lg mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  `,
}
const SkeletonFooter = {
  template: `
    <div class="mx-4 my-4 py-12">
      <div class="max-w-6xl mx-auto space-y-4">
        <div class="flex justify-center gap-4">
          <div v-for="i in 3" :key="i" class="h-6 w-6 skeleton-shimmer rounded-full"></div>
        </div>
        <div class="h-4 w-48 skeleton-shimmer rounded-lg mx-auto"></div>
        <div class="h-4 w-64 skeleton-shimmer rounded-lg mx-auto"></div>
      </div>
    </div>
  `,
}

// Below the fold — lazy load
const AboutSection = defineAsyncComponent({
  loader: () => import('./components/sections/AboutSection.vue'),
  loadingComponent: SkeletonWithTitle,
})
const ProjectsSection = defineAsyncComponent({
  loader: () => import('./components/sections/ProjectsSection.vue'),
  loadingComponent: SkeletonWithCards,
})
const TechStackSection = defineAsyncComponent({
  loader: () => import('./components/sections/TechStackSection.vue'),
  loadingComponent: SkeletonWithTitle,
})
const StatsSection = defineAsyncComponent({
  loader: () => import('./components/sections/StatsSection.vue'),
  loadingComponent: SkeletonGrid,
})
const ContactSection = defineAsyncComponent({
  loader: () => import('./components/sections/ContactSection.vue'),
  loadingComponent: SkeletonWithTitle,
})
const TheFooter = defineAsyncComponent({
  loader: () => import('./components/layout/TheFooter.vue'),
  loadingComponent: SkeletonFooter,
})

useTheme()
</script>

<template>
  <div class="min-h-screen bg-ivory dark:bg-dark-bg transition-colors duration-200">
    <TheHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <TechStackSection />
      <StatsSection />
      <ContactSection />
    </main>
    <TheFooter />
  </div>
</template>
