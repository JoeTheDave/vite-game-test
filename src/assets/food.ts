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
  renderer: Renderer
  color?: string
  size?: number
}

export default class Food extends GameObject {
  position: Position
  direction: number
  renderer: Renderer
  color: string
  size: number

  constructor(initializationOptions: ParticleInitializationOptions) {
    super()
    this.renderer = initializationOptions.renderer
    this.position = initializationOptions.position || {
      x: Math.floor(Math.random() * this.renderer.canvas.width),
      y: Math.floor(Math.random() * this.renderer.canvas.height),
    }
    this.direction = 0
    this.size = initializationOptions.size || Math.floor(Math.random() * 5)

    this.color =
      initializationOptions.color ||
      `rgb(${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 155) + 100}, ${
        Math.floor(Math.random() * 155) + 100
      })`

    this.update(0, {})
  }

  update = (delta: number, keys: { [key: string]: boolean }) => {}

  render = () => {
    this.renderer.drawCircle({
      position: this.position,
      radius: 2 + this.size,
      strokeColor: '#333',
      fillColor: this.color,
    })
  }
}
