import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { activeSceneId } from './useActiveSection'
import { WheelGesture, canReadInDirection, pageKeyframes } from '../utils/pageTransition'

type Source = 'wheel' | 'touch' | 'keyboard' | 'link' | 'history'
export function usePageScenes(root: Ref<HTMLElement | null>) {
  const currentIndex = ref(0), targetIndex = ref(0)
  const phase = ref<'idle' | 'animating'>('idle')
  const progress = ref(0), transitionEnergy = ref(0)
  let scenes: HTMLElement[] = []
  let animations: Animation[] = []
  let sequence = 0, frame = 0, timer: ReturnType<typeof setTimeout> | undefined
  let reduced: MediaQueryList | undefined
  let restoreFocus = false
  const gesture = new WheelGesture()
  let touch: { x: number; y: number; top: number; max: number; blocked: boolean } | null = null
  const port = (index = currentIndex.value) => scenes[index]?.querySelector<HTMLElement>('.scene-scrollport')
  const editable = (node: EventTarget | null) => node instanceof Element && !!node.closest('input,textarea,select,[contenteditable="true"]')
  function show(index: number, visible: boolean, interactive: boolean) {
    const scene = scenes[index]
    if (!scene) return
    scene.dataset.visible = String(visible)
    scene.dataset.active = String(interactive)
    scene.inert = !interactive
    scene.setAttribute('aria-hidden', String(!interactive))
  }
  function finish() {
    sequence++
    cancelAnimationFrame(frame); if (timer) clearTimeout(timer)
    currentIndex.value = targetIndex.value
    animations.forEach(animation => animation.cancel()); animations = []
    scenes.forEach((scene, index) => {
      show(index, index === currentIndex.value, index === currentIndex.value)
      scene.style.setProperty('--scene-energy', '0')
      scene.style.removeProperty('z-index')
      scene.querySelector<HTMLElement>('.scene-surface')?.style.removeProperty('will-change')
    })
    phase.value = 'idle'; transitionEnergy.value = 0
    activeSceneId.value = scenes[currentIndex.value]?.id || 'home'
    progress.value = currentIndex.value / Math.max(1, scenes.length - 1)
    if (restoreFocus) port()?.focus({ preventScroll: true })
    restoreFocus = false
  }
  function navigate(index: number, source: Source, immediate = false) {
    if (index < 0 || index >= scenes.length) return
    if (phase.value === 'animating') {
      if (source !== 'history') return
      finish()
    }
    if (index === currentIndex.value) {
      if (source === 'link') { port()?.scrollTo({ top: 0, behavior: 'instant' }); port()?.focus({ preventScroll: true }) }
      return
    }
    const previous = currentIndex.value, direction = index > previous ? 1 : -1
    targetIndex.value = index
    restoreFocus = source === 'keyboard' || !!(document.activeElement && scenes[previous].contains(document.activeElement))
    const incomingPort = port(index)
    if (incomingPort) incomingPort.scrollTop = (source === 'wheel' || source === 'touch') && direction < 0 ? incomingPort.scrollHeight : 0
    if (source !== 'history') history.pushState(null, '', '#' + scenes[index].id)
    if (immediate || reduced?.matches) { finish(); return }
    phase.value = 'animating'
    show(previous, true, false); show(index, true, false)
    scenes[index].style.zIndex = '2'; scenes[previous].style.zIndex = '1'
    const duration = innerWidth < 768 ? 680 : 860
    const token = ++sequence, started = performance.now()
    const options: KeyframeAnimationOptions = { duration, easing: 'cubic-bezier(.22,.65,.2,1)', fill: 'both' }
    for (const [sceneIndex, entering] of [[previous, false], [index, true]] as const) {
      const surface = scenes[sceneIndex].querySelector<HTMLElement>('.scene-surface')!
      surface.style.willChange = 'transform, opacity'
      animations.push(surface.animate(pageKeyframes(direction, entering, innerWidth < 768), options))
      scenes[sceneIndex].querySelectorAll<HTMLElement>('.scene-echo').forEach((echo, depth) => {
        const keys = pageKeyframes(direction, entering, innerWidth < 768).map(key => ({ ...key, transform: (key.transform === 'none' ? '' : key.transform) + ` translateZ(${-90 - depth * 100}px) scale(${1.03 + depth * .025})`, opacity: Number(key.opacity) * .35 }))
        animations.push(echo.animate(keys, options))
      })
    }
    const pulse = (now: number) => {
      if (token !== sequence) return
      const portion = Math.min(1, (now - started) / duration)
      transitionEnergy.value = Math.sin(portion * Math.PI)
      progress.value = (previous + (index - previous) * portion) / Math.max(1, scenes.length - 1)
      scenes[previous].style.setProperty('--scene-energy', String(transitionEnergy.value))
      scenes[index].style.setProperty('--scene-energy', String(transitionEnergy.value))
      if (portion < 1) frame = requestAnimationFrame(pulse)
    }
    frame = requestAnimationFrame(pulse)
    Promise.all(animations.map(animation => animation.finished.catch(() => undefined))).then(() => { if (token === sequence) finish() })
    // A visibility/resize event or missing finish callback must never strand a half-turned page.
    timer = setTimeout(() => { if (token === sequence) finish() }, duration + 180)
  }
  function wheel(event: WheelEvent) {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY || editable(event.target)) return
    const viewport = port(); if (!viewport) return
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1)
    const readable = canReadInDirection(viewport.scrollTop, viewport.scrollHeight, viewport.clientHeight, delta)
    const action = gesture.consume(delta, performance.now(), readable, phase.value === 'animating')
    if (action === 'read') {
      if (!(event.target instanceof Node) || !viewport.contains(event.target)) { event.preventDefault(); viewport.scrollBy({ top: delta, behavior: 'instant' }) }
      return
    }
    event.preventDefault()
    if (action === 'next' || action === 'previous') navigate(currentIndex.value + (action === 'next' ? 1 : -1), 'wheel')
  }
  function touchStart(event: TouchEvent) {
    const viewport = port()
    if (event.touches.length !== 1 || !viewport || editable(event.target)) { touch = null; return }
    touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, top: viewport.scrollTop, max: viewport.scrollHeight - viewport.clientHeight, blocked: phase.value === 'animating' }
  }
  function touchMove(event: TouchEvent) {
    if (!touch || event.touches.length !== 1) return
    const dy = touch.y - event.touches[0].clientY, dx = touch.x - event.touches[0].clientX
    const boundary = dy > 0 ? touch.top >= touch.max - 2 : touch.top <= 2
    if (touch.blocked || (boundary && Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx))) event.preventDefault()
  }
  function touchEnd(event: TouchEvent) {
    const start = touch; touch = null
    if (!start || start.blocked || phase.value === 'animating' || !event.changedTouches.length) return
    const dy = start.y - event.changedTouches[0].clientY, dx = start.x - event.changedTouches[0].clientX
    if (Math.abs(dy) < 50 || Math.abs(dy) < Math.abs(dx) * 1.2) return
    if (dy > 0 ? start.top >= start.max - 2 : start.top <= 2) navigate(currentIndex.value + (dy > 0 ? 1 : -1), 'touch')
  }
  function key(event: KeyboardEvent) {
    if (editable(event.target) || event.altKey || event.metaKey || event.key === 'Tab') return
    if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','PageDown','PageUp','Home','End'].includes(event.key)) return
    event.preventDefault()
    if (phase.value === 'animating') return
    const viewport = port(); if (!viewport) return
    const direction = ['ArrowUp','ArrowLeft','PageUp','Home'].includes(event.key) ? -1 : 1
    const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight'
    if ((event.key === 'Home' || event.key === 'End') && event.ctrlKey) { if (!event.repeat) navigate(direction < 0 ? 0 : scenes.length - 1, 'keyboard'); return }
    if (!horizontal && canReadInDirection(viewport.scrollTop, viewport.scrollHeight, viewport.clientHeight, direction)) {
      const distance = event.key.startsWith('Arrow') ? 70 : viewport.clientHeight * .88
      viewport.scrollTo({ top: event.key === 'Home' ? 0 : event.key === 'End' ? viewport.scrollHeight : viewport.scrollTop + direction * distance, behavior: 'instant' })
    } else if (!event.repeat) navigate(currentIndex.value + direction, 'keyboard')
  }
  function click(event: MouseEvent) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
    if (!anchor) return
    const index = scenes.findIndex(scene => '#' + scene.id === anchor.getAttribute('href'))
    if (index < 0) return
    event.preventDefault(); navigate(index, 'link')
  }
  function locationChanged() {
    const index = scenes.findIndex(scene => '#' + scene.id === location.hash)
    navigate(index < 0 ? 0 : index, 'history', true)
  }
  const cancelTouch = () => { touch = null }
  const settle = () => { if (phase.value === 'animating') finish() }
  onMounted(() => {
    scenes = [...(root.value?.querySelectorAll<HTMLElement>('.scene-shell') || [])]
    reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const initial = scenes.findIndex(scene => '#' + scene.id === location.hash)
    currentIndex.value = targetIndex.value = Math.max(0, initial)
    root.value?.setAttribute('data-ready', 'true'); document.documentElement.classList.add('paged-portfolio')
    finish()
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('touchstart', touchStart, { passive: true }); window.addEventListener('touchmove', touchMove, { passive: false }); window.addEventListener('touchend', touchEnd)
    window.addEventListener('touchcancel', cancelTouch)
    window.addEventListener('keydown', key); document.addEventListener('click', click)
    window.addEventListener('popstate', locationChanged); window.addEventListener('hashchange', locationChanged)
    window.addEventListener('resize', settle); document.addEventListener('visibilitychange', settle)
    reduced.addEventListener('change', settle)
  })
  onUnmounted(() => {
    sequence++; cancelAnimationFrame(frame); if (timer) clearTimeout(timer)
    animations.forEach(animation => animation.cancel())
    document.documentElement.classList.remove('paged-portfolio')
    window.removeEventListener('wheel', wheel);window.removeEventListener('touchstart', touchStart);window.removeEventListener('touchmove', touchMove);window.removeEventListener('touchend', touchEnd)
    window.removeEventListener('touchcancel', cancelTouch);window.removeEventListener('keydown', key);document.removeEventListener('click', click)
    window.removeEventListener('popstate', locationChanged);window.removeEventListener('hashchange', locationChanged)
    window.removeEventListener('resize', settle);document.removeEventListener('visibilitychange', settle);reduced?.removeEventListener('change', settle)
  })
  return { activeSceneId, currentIndex, targetIndex, phase, progress, transitionEnergy }
}
