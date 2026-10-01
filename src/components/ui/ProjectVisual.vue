<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps<{ projectId: string }>()
const { t } = useI18n()
const image = import.meta.env.BASE_URL + 'projects/dungeonD3.jpg'
const motifs: Record<string, string[]> = {
  holoHunter: ['SEARCH', 'COMPARE'], pixelOffice: ['AGENTS', 'CANVAS'],
  vueExcelDashboard: ['IMPORT', 'EDIT', 'EXPORT'], vueManageSystem: ['USERS', 'ROLES'],
  dcbotSeries: ['COMMAND', 'RESPONSE'], webPageSlip: ['SCROLL', 'MOTION'],
  partSmart: ['PARTS', 'PRICES'],
}
const labels = computed(() => motifs[props.projectId] || [])
</script>
<template>
  <figure v-if="projectId === 'dungeonD3'" class="project-visual project-shot">
    <img :src="image" :alt="t('editorial.screenshot')" width="480" height="408" loading="lazy" />
    <figcaption>{{ t('editorial.screenshot') }}</figcaption>
  </figure>
  <div v-else class="project-visual schematic" :class="'visual-' + projectId" role="img" :aria-label="t('editorial.schematic') + ': ' + t('projects.' + projectId + '.subtitle')">
    <span class="visual-caption">{{ t('editorial.schematic') }}</span>
    <div class="visual-motif" aria-hidden="true"><span v-for="(label, index) in labels" :key="label"><i v-if="index">↗</i>{{ label }}</span></div>
    <div class="visual-lines" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
  </div>
</template>
