// Totals calculation for DTE

import type { Detalle, Totales } from '../types/dte'
import { calculateIVA } from './iva'

export interface CalculatedTotals {
  MntNeto: number
  MntExe: number
  TasaIVA: number
  IVA: number
  MntTotal: number
}

export function calculateDetalleTotals(items: Detalle[]): CalculatedTotals {
  let neto = 0
  let exento = 0

  for (const item of items) {
    if (item.IndExe) {
      exento += item.MontoItem
    } else {
      neto += item.MontoItem
    }
  }

  const tasaIVA = 19
  const iva = calculateIVA(neto, tasaIVA)
  const total = neto + iva + exento

  return {
    MntNeto: neto,
    MntExe: exento,
    TasaIVA: tasaIVA,
    IVA: iva,
    MntTotal: total,
  }
}

export function applyGlobalDiscounts(
  totals: CalculatedTotals,
  discounts: Array<{ amount: number; isPercentage: boolean; taxable: boolean }>
): CalculatedTotals {
  let { MntNeto, MntExe, TasaIVA, IVA, MntTotal } = totals

  for (const discount of discounts) {
    const discountAmount = discount.isPercentage
      ? Math.round((MntTotal * discount.amount) / 100)
      : discount.amount

    if (discount.taxable) {
      MntNeto -= discountAmount
    } else {
      MntExe -= discountAmount
    }
  }

  IVA = calculateIVA(MntNeto, TasaIVA)
  MntTotal = MntNeto + IVA + MntExe

  return { MntNeto, MntExe, TasaIVA, IVA, MntTotal }
}

export function validateTotales(calculated: CalculatedTotals, declared: Totales): boolean {
  return (
    calculated.MntNeto === (declared.MntNeto || 0) &&
    calculated.MntExe === (declared.MntExe || 0) &&
    calculated.IVA === (declared.IVA || 0) &&
    calculated.MntTotal === declared.MntTotal
  )
}
