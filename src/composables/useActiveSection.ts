import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Tracks which section is currently visible in the viewport
 * using IntersectionObserver.
 *
 * Usage:
 *   const { activeSection } = useActiveSection()
 *   // activeSection.value → 'about' | 'projects' | 'tech' | 'contact' | ''
 */
export function useActiveSection() {
  const activeSection = ref<string>('')

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const sections = document.querySelectorAll('section[id]')

    if (!sections.length) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        })
      },
      {
        rootMargin: '-50% 0px -50% 0px', // triggers when section is in the middle of viewport
        threshold: 0,
      },
    )

    sections.forEach((section) => observer!.observe(section))
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { activeSection }
}
