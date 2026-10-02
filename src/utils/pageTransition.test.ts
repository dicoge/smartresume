import { describe, expect, it } from 'vitest'
import { WheelGesture, canReadInDirection, pageKeyframes } from './pageTransition'
describe('discrete page gestures', () => {
  it('navigates once per wheel burst, including long inertial tails', () => {
    const gesture = new WheelGesture()
    expect(gesture.consume(120, 0, false, false)).toBe('next')
    for (let t = 20; t < 1500; t += 20) expect(gesture.consume(80, t, false, t < 800)).toBe('wait')
    expect(gesture.consume(-120, 1800, false, false)).toBe('previous')
  })
  it('never converts a content-reading gesture into a page change at the boundary', () => {
    const gesture = new WheelGesture()
    expect(gesture.consume(120, 0, true, false)).toBe('read')
    expect(gesture.consume(120, 100, false, false)).toBe('wait')
    expect(gesture.consume(120, 500, false, false)).toBe('next')
  })
  it('accumulates small trackpad deltas without partially rotating the page', () => {
    const gesture = new WheelGesture()
    for (let t = 0; t < 3; t++) expect(gesture.consume(10, t * 10, false, false)).toBe('wait')
    expect(gesture.consume(10, 40, false, false)).toBe('next')
  })
  it('consumes input during an animation, including direction reversals', () => {
    const gesture = new WheelGesture()
    expect(gesture.consume(-120, 0, false, true)).toBe('wait')
    expect(gesture.consume(-120, 100, false, false)).toBe('wait')
    expect(gesture.consume(-120, 400, false, false)).toBe('previous')
  })
  it('preserves native reading until either end of long content', () => {
    expect(canReadInDirection(0, 2000, 700, 1)).toBe(true)
    expect(canReadInDirection(1300, 2000, 700, 1)).toBe(false)
    expect(canReadInDirection(1300, 2000, 700, -1)).toBe(true)
    expect(canReadInDirection(0, 2000, 700, -1)).toBe(false)
  })
  it('ends incoming pages flat and starts outgoing pages flat in both directions', () => {
    for (const direction of [-1, 1]) for (const mobile of [true, false]) {
      expect(pageKeyframes(direction, true, mobile).slice(-1)[0]?.transform).toBe('none')
      expect(pageKeyframes(direction, false, mobile)[0].transform).toBe('none')
    }
  })
  it('never cross-fades readable outgoing and incoming page content', () => {
    for (const direction of [-1, 1]) for (const mobile of [true, false]) {
      const outgoing = pageKeyframes(direction, false, mobile)
      const incoming = pageKeyframes(direction, true, mobile)
      const outgoingHiddenAt = outgoing.find(frame => frame.opacity === 0)!.offset as number
      const incomingHiddenThrough = incoming.filter(frame => frame.opacity === 0).slice(-1)[0]!.offset as number
      expect(outgoingHiddenAt).toBeLessThanOrEqual(incomingHiddenThrough)
      expect(outgoing.slice(-1)[0]?.opacity).toBe(0)
      expect(incoming[0].opacity).toBe(0)
    }
  })
})
