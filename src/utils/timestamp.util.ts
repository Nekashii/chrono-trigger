import { PRECISION } from '../constants'

export function roundToPrecision(timestamp: number) {
  return Math.round(timestamp / PRECISION) * PRECISION
}
