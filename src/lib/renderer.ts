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

  drawCircle = ({
    position,
    radius,
    strokeColor,
    fillColor,
  }: {
    position: Position
    radius: number
    strokeColor: string
    fillColor: string | CanvasGradient
  }) => {
    this.ctx.beginPath()
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2)
    this.ctx.closePath()
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor
      this.ctx.stroke()
    }
    if (fillColor) {
      this.ctx.fillStyle = fillColor
      this.ctx.fill()
    }
  }

  drawLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.strokeStyle = color
    this.ctx.stroke()
  }

  drawSmoothShape(points: Position[], strokeColor: string, fillColor: string | CanvasGradient) {
    if (points.length < 2) return

    this.ctx.beginPath()
    this.ctx.moveTo(points[0].x, points[0].y)

    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length]
      const p1 = points[i]
      const p2 = points[(i + 1) % points.length]
      const p3 = points[(i + 2) % points.length]

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
    }
    this.ctx.closePath()
    if (fillColor) {
      this.ctx.fillStyle = fillColor
      this.ctx.fill()
    }
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor
      this.ctx.lineWidth = 2
      this.ctx.stroke()
    }
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
    this.ctx.lineWidth = 1
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
