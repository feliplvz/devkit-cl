import type { PhoneFormatOptions } from '../types'

const DEFAULT_OPTIONS: PhoneFormatOptions = {
  includeCountryCode: true,
  useSpaces: true,
}

export function formatPhone(
  phone: string,
  options: PhoneFormatOptions = {}
): string {
  if (!phone || typeof phone !== 'string') return ''

  const opts = { ...DEFAULT_OPTIONS, ...options }

  let cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('56')) {
    cleaned = cleaned.slice(2)
  }

  if (cleaned.length < 8 || cleaned.length > 9) return ''

  const separator = opts.useSpaces ? ' ' : ''
  const countryCode = opts.includeCountryCode ? `+56${separator}` : ''

  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    const part1 = cleaned.slice(0, 1)
    const part2 = cleaned.slice(1, 5)
    const part3 = cleaned.slice(5)

    return `${countryCode}${part1}${separator}${part2}${separator}${part3}`
  }

  if (cleaned.length === 8) {
    const part1 = cleaned.slice(0, 1)
    const part2 = cleaned.slice(1, 5)
    const part3 = cleaned.slice(5)

    return `${countryCode}${part1}${separator}${part2}${separator}${part3}`
  }

  return ''
}

export function cleanPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return ''
  
  let cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('56') && cleaned.length > 9) {
    cleaned = cleaned.slice(2)
  }
  
  return cleaned
}
