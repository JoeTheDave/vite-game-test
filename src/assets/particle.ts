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
    // this.renderer.rotate(this.position, this.direction)
    this.renderer.drawCircle({ position: this.position, radius: this.radius, strokeColor: '#333', fillColor: '' })
    // this.renderer.clearRotation()
  }
}
