// IVA calculation utilities

const DEFAULT_IVA_RATE = 19 // 19%

export function calculateIVA(neto: number, rate: number = DEFAULT_IVA_RATE): number {
  return Math.round((neto * rate) / 100)
}

export function calculateNeto(total: number, rate: number = DEFAULT_IVA_RATE): number {
  return Math.round(total / (1 + rate / 100))
}

export function calculateTotal(neto: number, rate: number = DEFAULT_IVA_RATE): number {
  return neto + calculateIVA(neto, rate)
}

export function extractIVA(total: number, rate: number = DEFAULT_IVA_RATE): number {
  const neto = calculateNeto(total, rate)
  return total - neto
}

export function isNetoValid(neto: number, iva: number, rate: number = DEFAULT_IVA_RATE): boolean {
  return calculateIVA(neto, rate) === iva
}

export function isTotalValid(neto: number, iva: number, total: number): boolean {
  return neto + iva === total
}
