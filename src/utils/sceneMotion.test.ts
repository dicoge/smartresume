import { describe, expect, it } from 'vitest'
import { scenePose } from './sceneMotion'

describe('scroll scene choreography', () => {
  it('rotates the whole entering and leaving scene in opposite directions', () => {
    expect(scenePose(800, 1800, 1000, 0).rotateX).toBeGreaterThan(35)
    expect(scenePose(-800, 200, 1000, 0).rotateX).toBeLessThan(-20)
  })
  it('keeps long content front-facing until its final content has passed the reading region', () => {
    for (const top of [200, 0, -500, -2000]) {
      const pose = scenePose(top, top + 3500, 1000, 2)
      expect(pose.rotateX).toBe(0)
      expect(pose.opacity).toBe(1)
    }
    expect(scenePose(-3100, 400, 1000, 2).phase).toBe('exit')
  })
  it('is reversible with rapid direction changes and deterministic after resizing', () => {
    const before = scenePose(600, 1600, 1000, 1)
    scenePose(-700, 300, 1000, 1)
    scenePose(900, 1600, 700, 1, true)
    expect(scenePose(600, 1600, 1000, 1)).toEqual(before)
  })
  it('has a dramatic visible entry and a flat central reading plateau', () => {
    const entry = scenePose(750, 1750, 1000, 1)
    expect(entry.rotateX).toBeGreaterThan(75)
    expect(entry.depth).toBeLessThan(-500)
    expect(Math.abs(entry.rotateY)).toBeGreaterThan(24)
    expect(scenePose(220, 1300, 1000, 1).energy).toBe(0)
  })
  it('uses lighter mobile rotation and depth', () => {
    const desktop = scenePose(900, 1900, 1000, 0)
    const mobile = scenePose(900, 1900, 1000, 0, true)
    expect(mobile.rotateX).toBeLessThan(desktop.rotateX)
    expect(Math.abs(mobile.depth)).toBeLessThan(Math.abs(desktop.depth))
  })
  it('keeps reduced-motion and focused content readable', () => {
    const pose = scenePose(900, 1900, 1000, 0, false, true)
    expect(pose.rotateX).toBe(0)
    expect(pose.rotateY).toBe(0)
    expect(pose.opacity).toBe(1)
  })
  it('handles overscroll and unavailable viewport dimensions without invalid transforms', () => {
    expect(scenePose(5000, 6000, 1000, 0).rotateX).toBe(84)
    expect(scenePose(-6000, -5000, 1000, 0).rotateX).toBe(-84)
    expect(scenePose(0, 0, 0, 0).rotateX).toBe(0)
    expect(scenePose(NaN, 0, 1000, 0).rotateX).toBe(0)
  })
})
