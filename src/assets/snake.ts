import Renderer from '@/lib/renderer'
import { Position, GameObject } from '@/lib/types'
import Particle from '@/assets/particle'
import { degreesToRadians, distanceBetween, angleBetween, radiansToDegrees } from '@/lib/util'

export type ParticleInitializationOptions = {
  position: Position
  segments: number[]
  direction: number
  renderer: Renderer
}

export default class Snake implements GameObject {
  position: Position
  segments: Particle[]
  direction: number
  renderer: Renderer

  constructor(initializationOptions: ParticleInitializationOptions) {
    this.position = initializationOptions.position
    this.direction = initializationOptions.direction
    this.renderer = initializationOptions.renderer
    this.segments = []
    let distanceFromOrigin = 0
    initializationOptions.segments.forEach((radius, idx) => {
      let position = initializationOptions.position
      if (idx > 0) {
        const prevSegmentRadius = initializationOptions.segments[idx - 1]
        distanceFromOrigin += prevSegmentRadius + 5
        const angle = degreesToRadians(this.direction - 180)
        const x = distanceFromOrigin * Math.cos(angle)
        const y = distanceFromOrigin * Math.sin(angle)
        position = { x: position.x + x, y: position.y + y }
      }
      this.segments.push(
        new Particle({
          direction: this.direction,
          radius,
          position,
          renderer: this.renderer,
        }),
      )
    })
    this.update()
  }

  update = () => {
    this.segments.forEach((segment, idx) => {
      if (idx === 0) {
        return
      }
      const prevSegment = this.segments[idx - 1]
      const distance = distanceBetween(prevSegment.position, segment.position)
      const correctionDistance = distance - prevSegment.radius
      const correctionAngle = degreesToRadians(
        radiansToDegrees(angleBetween(prevSegment.position, segment.position)) - 180,
      )
      const x = correctionDistance * Math.cos(correctionAngle)
      const y = correctionDistance * Math.sin(correctionAngle)
      segment.position = { x: segment.position.x + x, y: segment.position.y + y }
      segment.direction = radiansToDegrees(correctionAngle)
    })
  }

  render = () => {
    this.segments.forEach(segment => segment.render())
    this.segments.forEach((segment, idx) => {
      if (idx === 0) {
        this.renderer.ctx.beginPath()
        const { x, y } = segment.position
        this.renderer.ctx.moveTo(x, y)
      } else {
        const { x, y } = segment.position
        this.renderer.ctx.lineTo(x, y)
        if ((idx = this.segments.length - 1)) {
          this.renderer.ctx.strokeStyle = 'white'
          this.renderer.ctx.stroke()
        }
      }
    })
  }
}
