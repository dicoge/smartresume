import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface ScrollRevealOptions {
  /** Tailwind / CSS classes applied once the element is visible */
  visibleClass?: string
  /** Tailwind / CSS classes applied while the element is still hidden */
  hiddenClass?: string
  /** IntersectionObserver threshold (0–1). Default: 0.15 */
  threshold?: number
  /** Only trigger once — element stays visible after the first reveal. Default: true */
  once?: boolean
}

/**
 * Attach to a template ref and the element will animate in when it
 * scrolls into the viewport.
 *
 * Usage:
 *   const el = ref<HTMLElement | null>(null)
 *   useScrollReveal(el)
 *   <section ref="el" ...>
 */
export function useScrollReveal(
  target: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {},
) {
  const {
    visibleClass = 'sr-visible',
    hiddenClass = 'sr-hidden',
    threshold = 0.15,
    once = true,
  } = options

  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!target.value) return

    target.value.classList.add(hiddenClass)

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove(hiddenClass)
            entry.target.classList.add(visibleClass)
            isVisible.value = true
            if (once && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            entry.target.classList.remove(visibleClass)
            entry.target.classList.add(hiddenClass)
            isVisible.value = false
          }
        })
      },
      { threshold },
    )

    observer.observe(target.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { isVisible }
}
