import Renderer from '@/lib/renderer'
import Snake from '@/assets/snake'
import Food from '@/assets/food'
import { GameObject } from '@/lib/types'

import {
  degreesToRadians,
  distanceBetween,
  angleBetween,
  radiansToDegrees,
  angleBetweenPoints,
  getRotatedPoint,
  getRadialPoint,
} from '@/lib/util'

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
        segments: [7, 7, 7, 7, 7],
        renderer: this.renderer,
        isPlayer: true,
        color: '#73a',
      }),
    )

    for (let i = 0; i < 30; i++) {
      this.assets.push(
        new Food({
          renderer: this.renderer,
        }),
      )
    }

    // for (let i = 0; i < 3; i++) {
    //   this.assets.push(
    //     new Snake({
    //       segments: [10, 10, 10, 10, 10],
    //       renderer: this.renderer,
    //     }),
    //   )
    // }
  }

  update = () => {
    const currentTick = performance.now()
    const delta = currentTick - this.lastTick
    this.lastTick = currentTick
    this.elapsedTime += delta
    this.delta = delta
    this.frames++

    const snakes = this.assets.filter(asset => asset instanceof Snake) as Snake[]
    const foods = this.assets.filter(asset => asset instanceof Food) as Food[]

    snakes.forEach(snake => {
      foods.forEach(food => {
        if (distanceBetween(snake.position, food.position) < snake.segments[0].radius) {
          snake.stomach += 1
          food.position = {
            x: Math.floor(Math.random() * this.renderer.canvas.width),
            y: Math.floor(Math.random() * this.renderer.canvas.height),
          }
          food.color = `rgb(${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 155) + 100}, ${
            Math.floor(Math.random() * 155) + 100
          })`
          food.size = Math.floor(Math.random() * 5)
          // this.assets.indexOf(food) > -1 && this.assets.splice(this.assets.indexOf(food), 1)
        }
      })
    })

    // console.log(snakes, food)

    this.assets.forEach(asset => {
      asset.update(this.delta / 1000, this.keys)
    })
  }
}
