// DTE structure validators

import type { DTEDocument, Detalle, Totales } from '../types/dte'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateDTEStructure(dte: DTEDocument): ValidationResult {
  const errors: string[] = []

  // Validar Detalle (max 60 items)
  if (dte.Detalle.length === 0) {
    errors.push('DTE debe tener al menos 1 item en Detalle')
  }
  if (dte.Detalle.length > 60) {
    errors.push('DTE no puede tener más de 60 items en Detalle')
  }

  // Validar DscRcgGlobal (max 20)
  if (dte.DscRcgGlobal && dte.DscRcgGlobal.length > 20) {
    errors.push('DTE no puede tener más de 20 descuentos/recargos globales')
  }

  // Validar Referencias (max 40)
  if (dte.Referencia && dte.Referencia.length > 40) {
    errors.push('DTE no puede tener más de 40 referencias')
  }

  // Validar SubTotInfo (max 20)
  if (dte.SubTotInfo && dte.SubTotInfo.length > 20) {
    errors.push('DTE no puede tener más de 20 subtotales informativos')
  }

  // Validar Comisiones (max 20)
  if (dte.Comisiones && dte.Comisiones.length > 20) {
    errors.push('DTE no puede tener más de 20 comisiones')
  }

  // Validar campos obligatorios Encabezado
  if (!dte.Encabezado.IdDoc) {
    errors.push('IdDoc es obligatorio')
  }
  if (!dte.Encabezado.Emisor) {
    errors.push('Emisor es obligatorio')
  }
  if (!dte.Encabezado.Receptor) {
    errors.push('Receptor es obligatorio')
  }
  if (!dte.Encabezado.Totales) {
    errors.push('Totales es obligatorio')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateDetalle(detalle: Detalle, index: number): ValidationResult {
  const errors: string[] = []

  // NroLinDet debe coincidir con índice
  if (detalle.NroLinDet !== index + 1) {
    errors.push(`Item ${index + 1}: NroLinDet debe ser ${index + 1}`)
  }

  // Nombre obligatorio
  if (!detalle.NmbItem || detalle.NmbItem.trim() === '') {
    errors.push(`Item ${index + 1}: NmbItem es obligatorio`)
  }

  // Nombre max 80 chars
  if (detalle.NmbItem && detalle.NmbItem.length > 80) {
    errors.push(`Item ${index + 1}: NmbItem no puede exceder 80 caracteres`)
  }

  // Descripción max 1000 chars
  if (detalle.DscItem && detalle.DscItem.length > 1000) {
    errors.push(`Item ${index + 1}: DscItem no puede exceder 1000 caracteres`)
  }

  // MontoItem obligatorio
  if (detalle.MontoItem === undefined || detalle.MontoItem === null) {
    errors.push(`Item ${index + 1}: MontoItem es obligatorio`)
  }

  // MontoItem debe ser >= 0
  if (detalle.MontoItem < 0) {
    errors.push(`Item ${index + 1}: MontoItem no puede ser negativo`)
  }

  // CdgItem max 5
  if (detalle.CdgItem && detalle.CdgItem.length > 5) {
    errors.push(`Item ${index + 1}: no puede tener más de 5 códigos`)
  }

  // Subcantidad max 20
  if (detalle.Subcantidad && detalle.Subcantidad.length > 20) {
    errors.push(`Item ${index + 1}: no puede tener más de 20 subcantidades`)
  }

  // SubDscto max 20
  if (detalle.SubDscto && detalle.SubDscto.length > 20) {
    errors.push(`Item ${index + 1}: no puede tener más de 20 sub-descuentos`)
  }

  // SubRecargo max 20
  if (detalle.SubRecargo && detalle.SubRecargo.length > 20) {
    errors.push(`Item ${index + 1}: no puede tener más de 20 sub-recargos`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateTotales(totales: Totales): ValidationResult {
  const errors: string[] = []

  // MntTotal obligatorio
  if (totales.MntTotal === undefined || totales.MntTotal === null) {
    errors.push('MntTotal es obligatorio')
  }

  // MntTotal debe ser > 0
  if (totales.MntTotal <= 0) {
    errors.push('MntTotal debe ser mayor a 0')
  }

  // Si hay IVA, debe haber MntNeto
  if (totales.IVA && totales.IVA > 0 && !totales.MntNeto) {
    errors.push('Si hay IVA, MntNeto es obligatorio')
  }

  // Si hay TasaIVA, debe estar entre 0-100
  if (totales.TasaIVA !== undefined && (totales.TasaIVA < 0 || totales.TasaIVA > 100)) {
    errors.push('TasaIVA debe estar entre 0 y 100')
  }

  // ImptoReten max 20
  if (totales.ImptoReten && totales.ImptoReten.length > 20) {
    errors.push('No puede haber más de 20 impuestos retenidos')
  }

  // Validar suma lógica
  const neto = totales.MntNeto || 0
  const exento = totales.MntExe || 0
  const iva = totales.IVA || 0
  const suma = neto + exento + iva

  if (Math.abs(suma - totales.MntTotal) > 1) {
    errors.push(`La suma (Neto + Exento + IVA) no coincide con MntTotal (diferencia: ${Math.abs(suma - totales.MntTotal)})`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateAllDetalles(detalles: Detalle[]): ValidationResult {
  const errors: string[] = []

  detalles.forEach((detalle, index) => {
    const result = validateDetalle(detalle, index)
    errors.push(...result.errors)
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
