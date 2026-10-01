import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { scenePose } from '../utils/sceneMotion'
import { activeSceneId } from './useActiveSection'

export function useScrollScenes(root: Ref<HTMLElement | null>) {
  const progress = ref(0)
  const transitionEnergy = ref(0)
  let frame = 0
  let disposed = false
  let observer: ResizeObserver | undefined
  let motion: MediaQueryList | undefined
  const update = () => {
    frame = 0
    if (!root.value) return
    const height = window.innerHeight
    const shells = [...root.value.querySelectorAll<HTMLElement>('.scene-shell')]
    const focused = document.activeElement
    // All geometry reads precede writes so transforms cannot feed back into measurements.
    const scenes = shells.map(shell => ({ shell, bounds: shell.getBoundingClientRect(), surface: shell.querySelector<HTMLElement>('.scene-surface') }))
    let current = shells[0]?.id || 'home'
    for (const { shell, bounds } of scenes) if (bounds.top <= height * 0.45) current = shell.id
    activeSceneId.value = current
    const distance = document.documentElement.scrollHeight - height
    progress.value = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0
    let energy = 0
    scenes.forEach(({ shell, bounds, surface }, index) => {
      if (!surface) return
      const focusNeedsStillness = !!focused && shell.contains(focused) && (focused.matches(':focus-visible') || focused.matches('input, textarea, select'))
      const pose = scenePose(bounds.top, bounds.bottom, height, index, window.innerWidth < 768, motion?.matches || focusNeedsStillness)
      const near = bounds.bottom > -height * 0.2 && bounds.top < height * 1.1
      surface.style.transformOrigin = pose.origin
      const transform = 'translate3d(' + pose.shiftX.toFixed(2) + 'px,' + pose.shiftY.toFixed(2) + 'px,' + pose.depth.toFixed(2) + 'px) rotateX(' + pose.rotateX.toFixed(2) + 'deg) rotateY(' + pose.rotateY.toFixed(2) + 'deg) rotateZ(' + pose.rotateZ.toFixed(2) + 'deg)'
      surface.style.transform = transform
      shell.style.setProperty('--scene-pose', transform)
      shell.style.setProperty('--scene-origin', pose.origin)
      shell.style.setProperty('--scene-energy', near ? String(pose.energy) : '0')
      if (near && bounds.top < height * .85 && bounds.bottom > height * .1) energy = Math.max(energy, pose.energy)
      surface.style.opacity = String(pose.opacity)
      surface.style.willChange = near && pose.phase !== 'read' && !motion?.matches ? 'transform, opacity' : 'auto'
      shell.dataset.motionState = pose.phase
      shell.dataset.rotation = pose.rotateX.toFixed(2)
    })
    transitionEnergy.value = motion?.matches ? 0 : energy
  }
  const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update) }
  const wake = () => { if (!document.hidden) schedule() }
  onMounted(() => {
    motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    motion.addEventListener('change', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('hashchange', schedule)
    window.addEventListener('popstate', schedule)
    window.addEventListener('pageshow', schedule)
    document.addEventListener('visibilitychange', wake)
    root.value?.addEventListener('focusin', schedule)
    root.value?.addEventListener('focusout', schedule)
    observer = new ResizeObserver(schedule)
    if (root.value) { observer.observe(root.value); root.value.querySelectorAll('.scene-shell').forEach(el => observer?.observe(el)) }
    document.fonts.ready.then(schedule)
    schedule()
  })
  onUnmounted(() => {
    disposed = true
    cancelAnimationFrame(frame)
    observer?.disconnect()
    motion?.removeEventListener('change', schedule)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('hashchange', schedule)
    window.removeEventListener('popstate', schedule)
    window.removeEventListener('pageshow', schedule)
    document.removeEventListener('visibilitychange', wake)
    root.value?.removeEventListener('focusin', schedule)
    root.value?.removeEventListener('focusout', schedule)
  })
  return { activeSceneId, progress, transitionEnergy }
}
