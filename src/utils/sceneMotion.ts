export interface ScenePose {
  phase: 'enter' | 'read' | 'exit'
  rotateX: number; rotateY: number; rotateZ: number
  depth: number; shiftX: number; shiftY: number
  opacity: number; energy: number; origin: string
}
const clamp = (value: number) => Math.max(0, Math.min(1, value))
/** Absolute layout geometry, not accumulated wheel deltas: touch, anchors and reverse scroll agree. */
export function scenePose(top: number, bottom: number, viewport: number, index: number, mobile = false, still = false): ScenePose {
  const neutral: ScenePose = { phase: 'read', rotateX: 0, rotateY: 0, rotateZ: 0, depth: 0, shiftX: 0, shiftY: 0, opacity: 1, energy: 0, origin: '50% 50%' }
  if (still || viewport <= 0 || !Number.isFinite(top + bottom + viewport)) return neutral
  const entering = clamp((top - viewport * .22) / (viewport * .62))
  const exiting = clamp((viewport * .58 - bottom) / (viewport * .5))
  const amount = Math.max(entering, exiting)
  if (!amount) return neutral
  // Fast visual lift at the edge, with zero derivative as the panel settles for reading.
  const lift = amount * amount * (3 - 2 * amount)
  const direction = index % 2 === 0 ? 1 : -1
  const leaving = exiting > entering
  return {
    phase: leaving ? 'exit' : 'enter',
    rotateX: (leaving ? -1 : 1) * lift * (mobile ? 68 : 84),
    rotateY: direction * (leaving ? -1 : 1) * lift * (mobile ? 12 : 28),
    rotateZ: direction * lift * (mobile ? 2 : 7),
    depth: -lift * (mobile ? 190 : 580),
    shiftX: direction * lift * (mobile ? 12 : 100),
    shiftY: (leaving ? 1 : -1) * lift * viewport * (mobile ? .11 : .2),
    opacity: 1 - lift * .22,
    energy: lift,
    origin: leaving ? '50% 100%' : '50% 0%',
  }
}
