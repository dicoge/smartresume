<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps<{ projectId: string }>()
const { t } = useI18n()
const screenshots: Record<string, { file: string; width: number; height: number; caption: string }> = {
  borrowedLight: { file: 'borrowedLight.webp', width: 1280, height: 720, caption: 'editorial.gameCover' },
  silentWires: { file: 'silentWires.webp', width: 1376, height: 768, caption: 'editorial.gameCover' },
  dungeonD3: { file: 'dungeonD3.webp', width: 1280, height: 720, caption: 'editorial.gameCover' },
  midnightPassport: { file: 'midnightPassport.webp', width: 1672, height: 941, caption: 'editorial.gameCover' },
  tenLivesCity: { file: 'tenLivesCity.webp', width: 1092, height: 656, caption: 'editorial.screenshot' },
  neonSpins: { file: 'neonSpins.webp', width: 1672, height: 941, caption: 'editorial.gameCover' },
  emberMoon: { file: 'emberMoon.webp', width: 1345, height: 770, caption: 'editorial.screenshot' },
  holoHunter: { file: 'holoHunter.webp', width: 1440, height: 960, caption: 'editorial.appScreenshot' },
}
const image = computed(() => screenshots[props.projectId])
const imageUrl = computed(() => image.value ? import.meta.env.BASE_URL + 'projects/' + image.value.file : '')
const motifs: Record<string, string[]> = {
  helloWorld: ['HELLO, WORLD!', 'CODE', 'EXPLORE'],
  holoHunter: ['SEARCH', 'COMPARE'], pixelOffice: ['AGENTS', 'CANVAS'],
  vueExcelDashboard: ['IMPORT', 'EDIT', 'EXPORT'], vueManageSystem: ['USERS', 'ROLES'],
  dcbotSeries: ['COMMAND', 'RESPONSE'], webPageSlip: ['SCROLL', 'MOTION'],
  partSmart: ['PARTS', 'PRICES'],
}
const labels = computed(() => motifs[props.projectId] || [])
</script>
<template>
  <figure v-if="image" class="project-visual project-shot">
    <img :src="imageUrl" :alt="t('projects.' + projectId + '.title') + ' — ' + t(image.caption)" :width="image.width" :height="image.height" loading="lazy" />
    <figcaption>{{ t(image.caption) }}</figcaption>
  </figure>
  <div v-else class="project-visual schematic" :class="'visual-' + projectId" role="img" :aria-label="t('editorial.schematic') + ': ' + t('projects.' + projectId + '.subtitle')">
    <span class="visual-caption">{{ t('editorial.schematic') }}</span>
    <div class="visual-motif" aria-hidden="true"><span v-for="(label, index) in labels" :key="label"><i v-if="index">↗</i>{{ label }}</span></div>
    <div class="visual-lines" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
  </div>
</template>
