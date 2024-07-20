import Renderer from '@/lib/renderer'
import Snake from '@/assets/snake'
import { GameObject } from '@/lib/types'
import { degreesToRadians } from '@/lib/util'

export default class GameData {
  renderer: Renderer
  keys: { [key: string]: boolean } = {}
  lastTick: number
  delta: number
  frames: number
  elapsedTime: number

  assets: GameObject[]

  constructor(renderer: Renderer) {
    this.renderer = renderer
    this.keys = {}
    this.lastTick = 0
    this.delta = 0
    this.frames = 0
    this.elapsedTime = 0
    this.assets = []

    this.assets.push(
      new Snake({
        position: {
          x: this.renderer.canvas.width / 2,
          y: this.renderer.canvas.height / 2,
        },
        direction: 30,
        segments: [
          40, 45, 50, 50, 45, 40, 35, 30, 25, 25, 25, 25, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
          20,
        ],
        renderer: this.renderer,
      }),
    )
  }

  update = () => {
    const currentTick = performance.now()
    const delta = currentTick - this.lastTick
    this.lastTick = currentTick
    this.elapsedTime += delta
    this.delta = delta
    this.frames++

    if (this.keys['a'] && (this.keys['w'] || this.keys['s'])) {
      this.assets[0].direction -= (180 * this.delta) / 1000
    }

    if (this.keys['d'] && (this.keys['w'] || this.keys['s'])) {
      this.assets[0].direction += (180 * this.delta) / 1000
    }

    if (this.keys['w']) {
      const movement = (300 * this.delta) / 1000
      const radians = degreesToRadians(this.assets[0].direction)
      const x = movement * Math.cos(radians)
      const y = movement * Math.sin(radians)
      this.assets[0].position.x += x
      this.assets[0].position.y += y
      this.assets[0].update()
    }

    if (this.keys['s']) {
      const movement = (-300 * this.delta) / 1000
      const radians = degreesToRadians(this.assets[0].direction)
      const x = movement * Math.cos(radians)
      const y = movement * Math.sin(radians)
      this.assets[0].position.x += x
      this.assets[0].position.y += y
      this.assets[0].update()
    }
  }
}
