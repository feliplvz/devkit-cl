import type { RutString } from '../types'

/**
 * Format RUT with standard Chilean format
 * @example formatRUT('123456789') // '12.345.678-9'
 */
export function formatRUT(rut: RutString): string {
  if (!rut || typeof rut !== 'string') return ''

  const cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase()

  if (cleaned.length < 2) return ''

  const rutBody = cleaned.slice(0, -1)
  const checkDigit = cleaned.slice(-1)

  const formatted = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${formatted}-${checkDigit}`
}

export function cleanRUT(rut: RutString): string {
  if (!rut || typeof rut !== 'string') return ''
  return rut.replace(/[^0-9kK]/g, '').toUpperCase()
}
