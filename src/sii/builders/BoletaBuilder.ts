// BoletaBuilder - Simplified builder for Boletas

import type { DTEDocument } from '../types/dte'
import { DTEBuilder } from './DTEBuilder'

export class BoletaBuilder extends DTEBuilder {
  private tipoBoletaExenta = false

  constructor() {
    super()
  }

  // Boleta Afecta (tipo 39)
  afecta(): this {
    super.setTipo(39)
    this.tipoBoletaExenta = false
    return this
  }

  // Boleta Exenta (tipo 41)
  exenta(): this {
    super.setTipo(41)
    this.tipoBoletaExenta = true
    return this
  }

  // Simplificado: agregar producto rápido
  addProducto(nombre: string, cantidad: number, precio: number): this {
    return this.addItem({
      nombre,
      cantidad,
      precio,
      monto: cantidad * precio,
      exento: this.tipoBoletaExenta, // Auto-marcar exento si es boleta exenta
    })
  }

  // Simplificado: agregar servicio
  addServicio(descripcion: string, monto: number): this {
    return this.addItem({
      nombre: descripcion,
      cantidad: 1,
      monto,
      exento: this.tipoBoletaExenta, // Auto-marcar exento si es boleta exenta
    })
  }

  // Override addItem para auto-marcar exento si es boleta exenta
  override addItem(item: {
    nombre: string
    cantidad?: number
    precio?: number
    monto?: number
    descripcion?: string
    unidad?: string
    exento?: boolean
  }): this {
    // Si no especificó exento y es boleta exenta, marcar automáticamente
    if (item.exento === undefined && this.tipoBoletaExenta) {
      item.exento = true
    }
    return super.addItem(item)
  }

  build(): DTEDocument {
    // Calcular totales automáticamente con IVA incluido (boletas chilenas)
    this.calculateBoletaTotals()
    return super.build()
  }

  private calculateBoletaTotals(): void {
    let totalExento = 0
    let totalAfecto = 0

    // Sumar items exentos y afectos
    for (const item of this.detalle) {
      if (item.IndExe) {
        totalExento += item.MontoItem
      } else {
        totalAfecto += item.MontoItem
      }
    }

    const tasaIVA = 19

    // Para boletas: el precio YA incluye IVA
    // IVA = Total / 1.19 * 0.19 (IVA incluido)
    // Neto = Total / 1.19
    const iva = totalAfecto > 0 ? Math.round((totalAfecto / 1.19) * 0.19) : 0
    const neto = totalAfecto > 0 ? totalAfecto - iva : 0
    const mntTotal = totalAfecto + totalExento

    // Aplicar descuentos globales si existen
    let finalNeto = neto
    let finalExento = totalExento
    let finalIva = iva
    let finalTotal = mntTotal

    if (this.descuentosGlobales.length > 0) {
      for (const desc of this.descuentosGlobales) {
        const descuentoMonto = desc.esPorcentaje
          ? Math.round((finalTotal * desc.valor) / 100)
          : desc.valor

        // Los descuentos se aplican al total afecto si es afecto
        if (totalAfecto > 0) {
          finalNeto = Math.max(0, finalNeto - descuentoMonto)
          finalIva = Math.round((finalNeto * tasaIVA) / 100)
        } else {
          finalExento = Math.max(0, finalExento - descuentoMonto)
        }
      }
      finalTotal = finalNeto + finalIva + finalExento
    }

    this.totales = {
      ...(finalNeto > 0 && { MntNeto: finalNeto }),
      ...(finalExento > 0 && { MntExe: finalExento }),
      ...(finalIva > 0 && { TasaIVA: tasaIVA }),
      ...(finalIva > 0 && { IVA: finalIva }),
      MntTotal: finalTotal,
    }
  }
}
