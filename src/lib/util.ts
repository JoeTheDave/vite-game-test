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

export const angleBetweenPoints = (p1: Position, p2: Position, p3: Position) => {
  const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x)
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x)
  let angle = radiansToDegrees(angle2 - angle1)
  if (angle < 0) angle += 360
  return angle
}

export const getRotatedPoint = (centerPoint: Position, transientPoint: Position, angle: number) => {
  const radians = degreesToRadians(angle)
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const nx = cos * (transientPoint.x - centerPoint.x) - sin * (transientPoint.y - centerPoint.y) + centerPoint.x
  const ny = sin * (transientPoint.x - centerPoint.x) + cos * (transientPoint.y - centerPoint.y) + centerPoint.y
  return { x: nx, y: ny }
}
