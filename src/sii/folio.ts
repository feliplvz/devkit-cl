export interface FolioValidationResult {
  valid: boolean
  error?: string
}

export function validateFolio(folio: number | string): FolioValidationResult {
  const folioNum = typeof folio === 'string' ? parseInt(folio, 10) : folio

  if (isNaN(folioNum)) {
    return { valid: false, error: 'Folio must be a valid number' }
  }

  if (folioNum < 1) {
    return { valid: false, error: 'Folio must be greater than 0' }
  }

  if (folioNum > 999999999) {
    return { valid: false, error: 'Folio exceeds maximum value' }
  }

  return { valid: true }
}

export function formatFolio(folio: number | string, length: number = 10): string {
  const folioNum = typeof folio === 'string' ? parseInt(folio, 10) : folio
  
  if (isNaN(folioNum)) return ''
  
  return folioNum.toString().padStart(length, '0')
}
