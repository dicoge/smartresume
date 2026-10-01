export type GestureOwner = 'none' | 'content' | 'page'
/** A wheel burst owns either reading or page navigation, never both. */
export class WheelGesture {
  private last = -Infinity
  private total = 0
  private owner: GestureOwner = 'none'
  constructor(private quietMs = 240, private threshold = 36) {}
  consume(delta: number, now: number, canRead: boolean, busy: boolean): 'read' | 'wait' | 'next' | 'previous' {
    if (now - this.last > this.quietMs) { this.total = 0; this.owner = 'none' }
    this.last = now
    if (busy) { this.owner = 'page'; return 'wait' }
    if (this.owner === 'page') return 'wait'
    if (this.owner === 'content') return canRead ? 'read' : 'wait'
    if (canRead) { this.owner = 'content'; return 'read' }
    this.total += delta
    if (Math.abs(this.total) < this.threshold) return 'wait'
    this.owner = 'page'
    return this.total > 0 ? 'next' : 'previous'
  }
}
export function canReadInDirection(top: number, scrollHeight: number, height: number, direction: number) {
  return direction > 0 ? top < scrollHeight - height - 2 : top > 2
}
export function pageKeyframes(direction: number, entering: boolean, mobile: boolean): Keyframe[] {
  const sign = entering ? direction : -direction
  const tilt = mobile ? 68 : 84
  const x = entering ? -1 : 1
  const edge = `translate3d(${sign * x * (mobile ? 3 : 10)}%,${sign * 52}%,${mobile ? -300 : -720}px) rotateX(${sign * -tilt}deg) rotateY(${sign * (mobile ? 10 : 24)}deg) rotateZ(${sign * -5}deg) scale(.82)`
  const mid = `translate3d(${sign * x * 3}%,${sign * 18}%,${mobile ? -100 : -220}px) rotateX(${sign * -34}deg) rotateY(${sign * 8}deg) rotateZ(${sign * -2}deg)`
  const frames: Keyframe[] = [
    { transform: edge, opacity: 0, offset: 0 },
    { transform: mid, opacity: .85, offset: .42 },
    { transform: 'none', opacity: 1, offset: 1 },
  ]
  return entering ? frames : frames.slice().reverse().map(frame => ({ ...frame, offset: 1 - Number(frame.offset) }))
}
