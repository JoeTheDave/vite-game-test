import Renderer from '@/lib/renderer'
import Snake from '@/assets/snake'
import { GameObject } from '@/lib/types'

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

    const segments: number[] = [40]
    for (let i = 0; i < 40; i++) {
      segments.push(Math.abs(segments[segments.length - 1] + Math.round(Math.random() * 2 - 1) - 1))
    }

    this.assets.push(
      new Snake({
        position: {
          x: this.renderer.canvas.width / 2,
          y: this.renderer.canvas.height / 2,
        },
        segments: [10, 10, 10, 10, 10].map(_ => _ * 5),
        renderer: this.renderer,
        isPlayer: true,
        color: '#73a',
      }),
    )

    for (let i = 0; i < 10; i++) {
      this.assets.push(
        new Snake({
          segments: [10, 10, 10, 10, 10],
          renderer: this.renderer,
        }),
      )
    }
  }

  update = () => {
    const currentTick = performance.now()
    const delta = currentTick - this.lastTick
    this.lastTick = currentTick
    this.elapsedTime += delta
    this.delta = delta
    this.frames++

    this.assets.forEach(asset => {
      asset.update(this.delta / 1000, this.keys)
    })
  }
}
