import { PRECISION } from '../constants'

export function roundToPrecision(timestamp: number, roundMethod: 'round' | 'ceil' | 'floor' = 'round') {
  return Math[roundMethod](timestamp / PRECISION) * PRECISION
}
