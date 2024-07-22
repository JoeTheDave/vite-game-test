import Renderer from '@/lib/renderer'
import { Position, GameObject } from '@/lib/types'
import Particle from '@/assets/particle'
import {
  degreesToRadians,
  distanceBetween,
  angleBetween,
  radiansToDegrees,
  angleBetweenPoints,
  getRotatedPoint,
  getRadialPoint,
} from '@/lib/util'

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
        segment.direction = this.direction
        return
      }
      // Follow the previous segment
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

      // Adjust position to correct for too sharp angle
      const anglularAllowance = 30
      if (idx > 1) {
        const startSegment = this.segments[idx - 2]
        const midSegment = this.segments[idx - 1]
        const angle = angleBetweenPoints(startSegment.position, midSegment.position, segment.position)
        const minAngle = 180 - anglularAllowance
        const maxAngle = 180 + anglularAllowance
        if (angle < minAngle) {
          const correctionAngle = minAngle - angle
          segment.position = getRotatedPoint(midSegment.position, segment.position, correctionAngle)
        }
        if (angle > maxAngle) {
          const correctionAngle = maxAngle - angle
          segment.position = getRotatedPoint(midSegment.position, segment.position, correctionAngle)
        }
      }
    })
  }

  render = () => {
    // Render Circles
    // this.segments.forEach(segment => segment.render())

    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i]
      if (i === 0) {
        for (let r = segment.direction - 90; r <= segment.direction + 90; r += 30) {
          const { x, y } = getRadialPoint(segment.position, segment.radius, r)
          if (r === segment.direction - 90) {
            this.renderer.ctx.beginPath()
            this.renderer.ctx.moveTo(x, y)
          } else {
            this.renderer.ctx.lineTo(x, y)
          }
        }
      } else if (i === this.segments.length - 1) {
        for (let r = segment.direction + 90; r <= segment.direction + 270; r += 30) {
          const { x, y } = getRadialPoint(segment.position, segment.radius, r)
          this.renderer.ctx.lineTo(x, y)
        }
      } else {
        const { x, y } = getRadialPoint(segment.position, segment.radius, segment.direction + 90)
        this.renderer.ctx.lineTo(x, y)
      }
    }
    for (let i = this.segments.length - 2; i >= 0; i--) {
      if (i > 0) {
        const segment = this.segments[i]
        const { x, y } = getRadialPoint(segment.position, segment.radius, segment.direction - 90)
        this.renderer.ctx.lineTo(x, y)
      } else {
        this.renderer.ctx.closePath()
        this.renderer.ctx.strokeStyle = '#F00'
        this.renderer.ctx.lineWidth = 3
        this.renderer.ctx.fillStyle = '#0B0'
        this.renderer.ctx.stroke()
        this.renderer.ctx.fill()
      }
    }

    // Render Spine
    // this.segments.forEach((segment, idx) => {
    //   if (idx === 0) {
    //     this.renderer.ctx.beginPath()
    //     const { x, y } = segment.position
    //     this.renderer.ctx.moveTo(x, y)
    //   } else {
    //     const { x, y } = segment.position
    //     this.renderer.ctx.lineTo(x, y)
    //     if ((idx = this.segments.length - 1)) {
    //       this.renderer.ctx.strokeStyle = '#666'
    //       this.renderer.ctx.stroke()
    //     }
    //   }
    // })
  }
}
