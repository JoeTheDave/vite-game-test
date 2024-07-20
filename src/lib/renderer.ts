import GameData from '@/lib/gameData'
import { degreesToRadians } from '@/lib/util'
import { Position } from '@/lib/types'

export default class Renderer {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  showPerformanceStatistics: boolean

  constructor(showPerformanceStatistics: boolean) {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.showPerformanceStatistics = showPerformanceStatistics

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  drawText = (text: string, x: number, y: number, fontSize: number, fontColor: string) => {
    this.ctx.font = `${fontSize}px Verdana`
    this.ctx.fillStyle = fontColor
    this.ctx.fillText(text, x, y)
  }

  drawCircle = (x: number, y: number, radius: number) => {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    //this.ctx.fillStyle = 'red'
    this.ctx.strokeStyle = 'white'
    this.ctx.stroke()
    // ctx.fill();
    this.ctx.closePath()
  }

  drawLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
  }

  rotate = (position: Position, rotationAngle: number) => {
    this.ctx.save()
    this.ctx.translate(position.x, position.y)
    this.ctx.rotate(degreesToRadians(rotationAngle))
    this.ctx.translate(-position.x, -position.y)
  }

  clearRotation = () => {
    this.ctx.restore()
  }

  clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawGridLines = () => {
    const lineSpacing = 50
    const beginX = (this.canvas.width / 2) % lineSpacing
    const beginY = (this.canvas.height / 2) % lineSpacing
    for (let x = beginX; x <= this.canvas.width; x += lineSpacing) {
      this.drawLine(x, 0, x, this.canvas.height, '#333')
    }
    for (let y = beginY; y <= this.canvas.height; y += lineSpacing) {
      this.drawLine(0, y, this.canvas.width, y, '#333')
    }
  }

  displayPerformanceStatistics = (data: GameData) => {
    const x = 5
    const y = 5
    const fontSize = 12
    const lineSpacing = fontSize + 2
    const fps = Math.floor(1000 / data.delta)
    const seconds = Math.floor(data.elapsedTime / 1000)
    this.drawText(`FPS: ${fps}`, x, y + lineSpacing * 1, fontSize, 'white')
    this.drawText(`Frames: ${data.frames}`, x, y + lineSpacing * 2, fontSize, 'white')
    this.drawText(`Time: ${seconds}`, x, y + lineSpacing * 3, fontSize, 'white')
  }

  draw = (data: GameData) => {
    this.clear()
    this.drawGridLines()

    data.assets.forEach(asset => asset.render())

    if (this.showPerformanceStatistics) {
      this.displayPerformanceStatistics(data)
    }
  }
}
