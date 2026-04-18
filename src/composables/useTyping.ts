import { ref, watch, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue'

export function useTyping(
  texts: string[] | Ref<string[]> | ComputedRef<string[]>,
  typeSpeed = 100,
  deleteSpeed = 30,
  pauseTime = 2000,
) {
  const displayText = ref('')
  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  let timer: ReturnType<typeof setTimeout> | null = null

  const getTexts = (): string[] =>
    typeof texts === 'object' && 'value' in texts ? texts.value : (texts as string[])

  function stop() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function restart() {
    stop()
    textIndex = 0
    charIndex = 0
    isDeleting = false
    displayText.value = ''
    tick()
  }

  function tick() {
    const currentTexts = getTexts()
    if (!currentTexts.length) return
    const currentText = currentTexts[textIndex % currentTexts.length]

    if (!isDeleting) {
      displayText.value = currentText.substring(0, charIndex + 1)
      charIndex++

      if (charIndex === currentText.length) {
        timer = setTimeout(() => {
          isDeleting = true
          tick()
        }, pauseTime)
        return
      }
      timer = setTimeout(tick, typeSpeed)
    } else {
      displayText.value = currentText.substring(0, charIndex - 1)
      charIndex--

      if (charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % currentTexts.length
      }
      timer = setTimeout(tick, deleteSpeed)
    }
  }

  // Watch for reactive texts changes (e.g. language switch)
  if (typeof texts === 'object' && 'value' in texts) {
    watch(texts as Ref<string[]>, () => {
      restart()
    })
  }

  onMounted(() => {
    tick()
  })

  onUnmounted(() => {
    stop()
  })

  return { displayText }
}
