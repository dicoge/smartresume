<script setup lang="ts">
defineProps<{ id: string; index: number; label: string }>()
</script>
<template>
  <div :id="id" class="scene-shell" role="region" :aria-label="label">
    <div class="scene-surface">
      <div class="scene-caption" aria-hidden="true"><span>{{ String(index).padStart(2, '0') }} / {{ label }}</span><span>〈 {{ id }} 〉</span></div>
      <div class="scene-scrollport" tabindex="0" :aria-label="label"><slot /></div>
    </div>
  </div>
</template>
