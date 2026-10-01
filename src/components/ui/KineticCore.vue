<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
// Pause the decorative model outside the viewport and when the tab is hidden.
const element = ref<HTMLElement | null>(null)
const playing = ref(true)
let visible = true
let observer: IntersectionObserver | undefined
const sync = () => { playing.value = visible && !document.hidden }
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; sync() })
  if (element.value) observer.observe(element.value)
  document.addEventListener('visibilitychange', sync)
})
onUnmounted(() => { observer?.disconnect(); document.removeEventListener('visibilitychange', sync) })
</script>
<template>
  <div ref="element" class="kinetic-core" aria-hidden="true" :style="{ '--core-play': playing ? 'running' : 'paused' }">
    <div class="core-orbit orbit-one" /><div class="core-orbit orbit-two" /><div class="core-orbit orbit-three" />
    <div class="core-rig"><div class="core-spin">
      <span class="core-face face-front">&lt;/&gt;</span><span class="core-face face-back">{ }</span>
      <span class="core-face face-left">[ ]</span><span class="core-face face-right">( )</span>
      <span class="core-face face-top" /><span class="core-face face-bottom" />
    </div></div>
    <span class="core-axis axis-x" /><span class="core-axis axis-y" />
    <span class="core-coordinate">X · Y · Z</span><span class="core-label">SOFTWARE / INTERACTION</span>
  </div>
</template>
