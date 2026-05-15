import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTyping } from './useTyping'
import { nextTick, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

// Mock timers for testing
vi.useFakeTimers()

describe('useTyping', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should accept string array and return displayText ref', () => {
    const texts = ['hello', 'world']
    const { displayText } = useTyping(texts)
    expect(displayText.value).toBeDefined()
    expect(typeof displayText.value).toBe('string')
  })

  it('should initially display the first text after mounting', async () => {
    const texts = ['hello', 'world']

    const TestComponent = defineComponent({
      setup() {
        const { displayText } = useTyping(texts)
        return { displayText }
      },
      template: '<span>{{ displayText }}</span>',
    })

    const wrapper = mount(TestComponent, {
      global: {
        stubs: {
          Transition: true,
        },
      },
    })

    // After first tick (onMounted), 'h' is typed
    await nextTick()
    expect(wrapper.text()).toBe('h')
  })

  it('should show correct text at different typing stages', async () => {
    const texts = ['abc']

    const TestComponent = defineComponent({
      setup() {
        const { displayText } = useTyping(texts)
        return { displayText }
      },
      template: '<span>{{ displayText }}</span>',
    })

    const wrapper = mount(TestComponent, {
      global: {
        stubs: {
          Transition: true,
        },
      },
    })

    // Initial state (empty)
    await nextTick()
    // After first tick (onMounted), 'a' is typed
    expect(wrapper.text()).toBe('a')

    // Advance timer to type second character
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    expect(wrapper.text()).toBe('ab')

    // Advance timer to type third character
    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    expect(wrapper.text()).toBe('abc')
  })
})