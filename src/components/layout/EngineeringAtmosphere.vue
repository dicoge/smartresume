<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
const props = defineProps<{ energy: number; progress: number }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let context: CanvasRenderingContext2D | null = null
let raf = 0, width = 0, height = 0, x = 0, y = 0, targetX = 0, targetY = 0, glow = 0
let reduced: MediaQueryList | undefined, fine: MediaQueryList | undefined
let observer: MutationObserver | undefined
let disposed = false
function paint() {
  raf = 0
  if (!context || !canvas.value || document.hidden) return
  const still = reduced?.matches
  x += (targetX - x) * .12; y += (targetY - y) * .12
  const targetGlow = still ? 0 : props.energy
  glow += (targetGlow - glow) * .2
  const root = document.documentElement
  root.style.setProperty('--pointer-x', still ? '0' : x.toFixed(3))
  root.style.setProperty('--pointer-y', still ? '0' : y.toFixed(3))
  const dark = root.classList.contains('dark')
  context.clearRect(0, 0, width, height)
  if (still) return
  const cx = width * .5 + x * 65, cy = height * .44 + y * 45
  const angle = props.progress * Math.PI * 1.6 + x * .08
  const cosine = Math.cos(angle), sine = Math.sin(angle)
  const project = (u: number, v: number, scale: number): [number, number] => [cx + (u * cosine - v * sine) * scale, cy + (u * sine + v * cosine) * scale]
  context.lineWidth = width < 768 ? .8 : 1
  // Nine concentric circuit planes form a tunnel; scroll advances its depth, not the page.
  for (let i = 0; i < 9; i++) {
    const z = (i + props.progress * 24) % 9
    const scale = 1 / (.65 + z * .58)
    const alpha = (dark ? .06 : .045) + glow * .23 * (1 - z / 12)
    context.strokeStyle = `rgba(${i % 2 ? '142,113,255' : '73,216,255'},${alpha})`
    const points = [[-width*.64,-height*.7],[width*.64,-height*.7],[width*.64,height*.7],[-width*.64,height*.7]]
    context.beginPath()
    points.forEach(([u,v], index) => { const [px,py] = project(u,v,scale); if(index===0)context!.moveTo(px,py);else context!.lineTo(px,py) })
    context.closePath(); context.stroke()
  }
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 + angle
    const rx = Math.cos(a) * width, ry = Math.sin(a) * height
    const phase = ((i * .117 + props.progress * 9) % 1)
    const begin = .18 + phase * .75, end = begin + .035 + glow * .18
    const gradient = context.createLinearGradient(cx+rx*begin,cy+ry*begin,cx+rx*end,cy+ry*end)
    gradient.addColorStop(0,'rgba(83,221,255,0)');gradient.addColorStop(1,`rgba(83,221,255,${(dark?.18:.09)+glow*.55})`)
    context.strokeStyle = gradient;context.lineWidth = 1.4
    context.beginPath();context.moveTo(cx+rx*begin,cy+ry*begin);context.lineTo(cx+rx*end,cy+ry*end);context.stroke()
  }
  if (Math.abs(targetX-x)+Math.abs(targetY-y)+Math.abs(targetGlow-glow)>.004) schedule()
}
function schedule() { if (!raf && !disposed) raf = requestAnimationFrame(paint) }
function resize() {
  if (!canvas.value || !context) return
  width = innerWidth; height = innerHeight
  const ratio = Math.min(devicePixelRatio || 1, width < 768 ? 1 : 1.5)
  canvas.value.width = Math.round(width * ratio); canvas.value.height = Math.round(height * ratio)
  context.setTransform(ratio,0,0,ratio,0,0); schedule()
}
function pointer(event: PointerEvent) {
  if (!fine?.matches || reduced?.matches || event.pointerType === 'touch') return
  targetX = event.clientX / width * 2 - 1; targetY = event.clientY / height * 2 - 1; schedule()
}
function reset() { targetX = 0; targetY = 0; schedule() }
function wake() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0 } else resize() }
watch(() => [props.energy, props.progress], schedule)
onMounted(() => {
  context = canvas.value?.getContext('2d') || null
  reduced = matchMedia('(prefers-reduced-motion: reduce)'); fine = matchMedia('(pointer: fine)')
  reduced.addEventListener('change', reset)
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('pointermove', pointer, { passive: true })
  document.documentElement.addEventListener('pointerleave', reset)
  document.addEventListener('visibilitychange', wake)
  observer = new MutationObserver(schedule); observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  resize()
})
onUnmounted(() => {
  disposed = true; cancelAnimationFrame(raf); observer?.disconnect()
  reduced?.removeEventListener('change', reset)
  window.removeEventListener('resize', resize);window.removeEventListener('pointermove', pointer)
  document.documentElement.removeEventListener('pointerleave', reset);document.removeEventListener('visibilitychange', wake)
  document.documentElement.style.removeProperty('--pointer-x');document.documentElement.style.removeProperty('--pointer-y')
})
</script>
<template><canvas ref="canvas" class="engineering-atmosphere" aria-hidden="true" /></template>
