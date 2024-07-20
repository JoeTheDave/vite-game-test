import Renderer from '@/lib/renderer'

export type Position = {
  x: number
  y: number
}

export interface GameObject {
  renderer: Renderer
  position: Position
  direction: number
  update: () => void
  render: () => void
}
