import { Position } from '@/lib/types'

export const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const radiansToDegrees = (radians: number) => {
  return radians * (180 / Math.PI)
}

export const distanceBetween = (p1: Position, p2: Position) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

export const angleBetween = (p1: Position, p2: Position) => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}
