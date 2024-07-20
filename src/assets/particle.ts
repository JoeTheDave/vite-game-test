import Renderer from '@/lib/renderer'
import { Position, GameObject } from '@/lib/types'

export type ParticleInitializationOptions = {
  position: Position
  radius: number
  direction: number
  renderer: Renderer
}

export default class Particle implements GameObject {
  position: Position
  radius: number
  direction: number
  renderer: Renderer

  constructor(initializationOptions: ParticleInitializationOptions) {
    this.position = initializationOptions.position
    this.radius = initializationOptions.radius
    this.direction = initializationOptions.direction
    this.renderer = initializationOptions.renderer
  }

  update = () => {}

  render = () => {
    const { x, y } = this.position
    this.renderer.rotate(this.position, this.direction)
    this.renderer.drawCircle(x, y, this.radius)
    this.renderer.clearRotation()
  }
}
