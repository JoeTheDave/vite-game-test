import color from 'color'
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
  position?: Position
  segments: number[]
  direction?: number
  renderer: Renderer
  isPlayer?: boolean
  color?: string
}

export default class Snake extends GameObject {
  position: Position
  segments: Particle[]
  direction: number
  renderer: Renderer
  isPlayer: boolean
  color: string

  constructor(initializationOptions: ParticleInitializationOptions) {
    super()
    this.renderer = initializationOptions.renderer
    this.position = initializationOptions.position || {
      x: Math.floor(Math.random() * this.renderer.canvas.width),
      y: Math.floor(Math.random() * this.renderer.canvas.height),
    }
    this.direction = initializationOptions.direction || Math.floor(Math.random() * 360)

    this.isPlayer = initializationOptions.isPlayer || false
    this.color =
      initializationOptions.color ||
      `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    this.segments = []
    let distanceFromOrigin = 0
    initializationOptions.segments.forEach((radius, idx) => {
      let position = this.position
      if (idx > 0) {
        const prevSegmentRadius = initializationOptions.segments[idx - 1]
        distanceFromOrigin += prevSegmentRadius + 5
        const angle = degreesToRadians(this.direction - 180)
        const x = distanceFromOrigin * Math.cos(angle)
        const y = distanceFromOrigin * Math.sin(angle)
        position = { x: this.position.x + x, y: this.position.y + y }
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
    this.update(0, {})
  }

  update = (delta: number, keys: { [key: string]: boolean }) => {
    const moveSpeed = 200
    const turnSpeed = 360
    if (this.isPlayer) {
      if (keys['a'] && keys['w']) {
        this.direction -= turnSpeed * delta
      }

      if (keys['d'] && keys['w']) {
        this.direction += turnSpeed * delta
      }

      if (keys['w']) {
        const movement = moveSpeed * delta
        const radians = degreesToRadians(this.direction)
        const x = movement * Math.cos(radians)
        const y = movement * Math.sin(radians)
        this.position.x += x
        this.position.y += y
      }
    } else {
      // AI Logic
    }

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
      const anglularAllowance = 60
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

    const points: Position[] = []
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i]
      if (i === 0) {
        for (let r = segment.direction - 120; r <= segment.direction + 120; r += 30) {
          points.push(getRadialPoint(segment.position, segment.radius, r))
        }
      } else if (i === this.segments.length - 1) {
        for (let r = segment.direction + 60; r <= segment.direction + 300; r += 30) {
          points.push(getRadialPoint(segment.position, segment.radius, r))
        }
      } else {
        points.push(getRadialPoint(segment.position, segment.radius, segment.direction + 60))
        points.push(getRadialPoint(segment.position, segment.radius, segment.direction + 90))
        points.push(getRadialPoint(segment.position, segment.radius, segment.direction + 120))
      }
    }
    for (let i = this.segments.length - 2; i > 0; i--) {
      const segment = this.segments[i]
      points.push(getRadialPoint(segment.position, segment.radius, segment.direction - 120))
      points.push(getRadialPoint(segment.position, segment.radius, segment.direction - 90))
      points.push(getRadialPoint(segment.position, segment.radius, segment.direction - 60))
    }

    // Draw outline points
    // points.forEach(point => this.renderer.drawCircle(point.x, point.y, 2, 'red'))

    // Fill Shape with gradient
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const segment = this.segments[i]
      const gradient = this.renderer.ctx.createRadialGradient(
        segment.position.x,
        segment.position.y,
        i % 2 === 0 ? 0 : segment.radius,
        segment.position.x,
        segment.position.y,
        i % 2 === 0 ? segment.radius : 0,
      )
      gradient.addColorStop(0, color(this.color).lighten(0.15).toString())
      gradient.addColorStop(1, this.color)

      this.renderer.drawCircle({
        position: segment.position,
        radius: segment.radius,
        fillColor: gradient,
      })
    }

    // Draw outline
    this.renderer.drawSmoothShape(points, color(this.color).lighten(0.25).hex(), 'transparent')

    // Draw Eyes
    const headSegment = this.segments[0]
    const leftEyePosition = getRadialPoint(headSegment.position, headSegment.radius * 0.75, headSegment.direction - 30)
    const rightEyePosition = getRadialPoint(headSegment.position, headSegment.radius * 0.75, headSegment.direction + 30)
    this.renderer.drawCircle({
      position: leftEyePosition,
      radius: headSegment.radius * 0.2,
      fillColor: 'white',
      strokeColor: 'black',
    })
    this.renderer.drawCircle({
      position: rightEyePosition,
      radius: headSegment.radius * 0.2,
      fillColor: 'white',
      strokeColor: 'black',
    })

    const leftPupilPosition = getRadialPoint(
      headSegment.position,
      headSegment.radius * 0.85,
      headSegment.direction - 30,
    )
    const rightPulilPosition = getRadialPoint(
      headSegment.position,
      headSegment.radius * 0.85,
      headSegment.direction + 30,
    )
    this.renderer.drawCircle({ position: leftPupilPosition, radius: headSegment.radius * 0.1, fillColor: 'black' })
    this.renderer.drawCircle({ position: rightPulilPosition, radius: headSegment.radius * 0.1, fillColor: 'black' })

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
