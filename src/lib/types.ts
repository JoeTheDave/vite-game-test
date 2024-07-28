import Renderer from '@/lib/renderer'

export type Position = {
  x: number
  y: number
}

export abstract class GameObject {
  abstract renderer: Renderer
  abstract position: Position
  abstract direction: number
  abstract update: (delta: number, keys: { [key: string]: boolean }) => void
  abstract render: () => void
}
