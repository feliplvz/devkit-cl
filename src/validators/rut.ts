import type { RutString, RutValidationResult } from '../types'

function cleanRut(rut: RutString): string {
  return rut.replace(/[.-]/g, '').trim().toUpperCase()
}

function calculateCheckDigit(rutBody: string): string {
  let sum = 0
  let multiplier = 2

  for (let i = rutBody.length - 1; i >= 0; i--) {
    sum += parseInt(rutBody[i]!) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = sum % 11
  const checkDigit = 11 - remainder

  if (checkDigit === 11) return '0'
  if (checkDigit === 10) return 'K'
  return checkDigit.toString()
}

export function validateRUT(rut: RutString): boolean {
  if (!rut || typeof rut !== 'string') return false

  const cleaned = cleanRut(rut)
  
  if (cleaned.length < 2) return false

  const rutBody = cleaned.slice(0, -1)
  const checkDigit = cleaned.slice(-1)

  if (!/^\d+$/.test(rutBody)) return false

  const calculatedDigit = calculateCheckDigit(rutBody)
  
  return calculatedDigit === checkDigit
}

export function validateRUTDetailed(rut: RutString): RutValidationResult {
  if (!rut || typeof rut !== 'string') {
    return { valid: false, error: 'RUT must be a non-empty string' }
  }

  const cleaned = cleanRut(rut)

  if (cleaned.length < 2) {
    return { valid: false, error: 'RUT is too short' }
  }

  const rutBody = cleaned.slice(0, -1)
  const checkDigit = cleaned.slice(-1)

  if (!/^\d+$/.test(rutBody)) {
    return { valid: false, error: 'Invalid RUT format' }
  }

  const calculatedDigit = calculateCheckDigit(rutBody)

  if (calculatedDigit !== checkDigit) {
    return { valid: false, error: 'Invalid check digit' }
  }

  const formatted = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + checkDigit

  return { valid: true, formatted }
}

export const isValidRUT = validateRUT
