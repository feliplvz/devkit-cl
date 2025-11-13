import { describe, it, expect } from 'vitest'
import { calculateDetalleTotals, applyGlobalDiscounts } from '../totales'
import type { Detalle } from '../../types/dte'

describe('calculateDetalleTotals', () => {
  it('calcula totales de un item afecto simple', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        NmbItem: 'Servicio',
        QtyItem: 1,
        PrcItem: 10000,
        MontoItem: 10000,
      },
    ]

    const totales = calculateDetalleTotals(detalles)

    expect(totales.MntNeto).toBe(10000)
    expect(totales.MntExe).toBe(0)
    expect(totales.TasaIVA).toBe(19)
    expect(totales.IVA).toBe(1900)
    expect(totales.MntTotal).toBe(11900)
  })

  it('calcula totales con múltiples items afectos', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        NmbItem: 'Item 1',
        QtyItem: 2,
        PrcItem: 5000,
        MontoItem: 10000,
      },
      {
        NroLinDet: 2,
        NmbItem: 'Item 2',
        QtyItem: 1,
        PrcItem: 20000,
        MontoItem: 20000,
      },
    ]

    const totales = calculateDetalleTotals(detalles)

    expect(totales.MntNeto).toBe(30000)
    expect(totales.IVA).toBe(5700)
    expect(totales.MntTotal).toBe(35700)
  })

  it('calcula totales con items exentos (IndExe=1)', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        NmbItem: 'Afecto',
        QtyItem: 1,
        PrcItem: 10000,
        MontoItem: 10000,
      },
      {
        NroLinDet: 2,
        IndExe: 1,
        NmbItem: 'Exento',
        QtyItem: 1,
        PrcItem: 5000,
        MontoItem: 5000,
      },
    ]

    const totales = calculateDetalleTotals(detalles)

    expect(totales.MntNeto).toBe(10000)
    expect(totales.MntExe).toBe(5000)
    expect(totales.IVA).toBe(1900)
    expect(totales.MntTotal).toBe(16900)
  })

  it('calcula totales solo con items exentos', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        IndExe: 1,
        NmbItem: 'Exento 1',
        QtyItem: 2,
        PrcItem: 5000,
        MontoItem: 10000,
      },
      {
        NroLinDet: 2,
        IndExe: 1,
        NmbItem: 'Exento 2',
        QtyItem: 1,
        PrcItem: 15000,
        MontoItem: 15000,
      },
    ]

    const totales = calculateDetalleTotals(detalles)

    expect(totales.MntNeto).toBe(0)
    expect(totales.MntExe).toBe(25000)
    expect(totales.IVA).toBe(0)
    expect(totales.TasaIVA).toBe(19)
    expect(totales.MntTotal).toBe(25000)
  })

  it('maneja lista vacía de detalles', () => {
    const totales = calculateDetalleTotals([])

    expect(totales.MntNeto).toBe(0)
    expect(totales.MntExe).toBe(0)
    expect(totales.MntTotal).toBe(0)
  })

  it('calcula correctamente con cantidades decimales', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        NmbItem: 'Item',
        QtyItem: 2.5,
        PrcItem: 1000,
        MontoItem: 2500,
      },
    ]

    const totales = calculateDetalleTotals(detalles)

    expect(totales.MntNeto).toBe(2500)
    expect(totales.IVA).toBe(475)
    expect(totales.MntTotal).toBe(2975)
  })

  it('redondea correctamente totales intermedios', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        NmbItem: 'Item',
        QtyItem: 1,
        PrcItem: 10001,
        MontoItem: 10001,
      },
    ]

    const totales = calculateDetalleTotals(detalles)

    expect(totales.MntNeto).toBe(10001)
    expect(totales.IVA).toBe(1900)
    expect(totales.MntTotal).toBe(11901)
  })

  it('maneja caso real complejo: factura con 3 items mixtos', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        NmbItem: 'Desarrollo Software',
        QtyItem: 1,
        PrcItem: 1000000,
        MontoItem: 1000000,
      },
      {
        NroLinDet: 2,
        NmbItem: 'Hosting',
        QtyItem: 12,
        PrcItem: 5000,
        MontoItem: 60000,
      },
      {
        NroLinDet: 3,
        IndExe: 1,
        NmbItem: 'Libros técnicos',
        QtyItem: 3,
        PrcItem: 15000,
        MontoItem: 45000,
      },
    ]

    const totales = calculateDetalleTotals(detalles)

    expect(totales.MntNeto).toBe(1060000)
    expect(totales.MntExe).toBe(45000)
    expect(totales.IVA).toBe(201400)
    expect(totales.MntTotal).toBe(1306400)
  })
})

describe('applyGlobalDiscounts', () => {
  it('aplica descuento porcentual sobre neto', () => {
    const totales = {
      MntNeto: 10000,
      MntExe: 0,
      TasaIVA: 19,
      IVA: 1900,
      MntTotal: 11900,
    }

    const result = applyGlobalDiscounts(totales, [
      { amount: 10, isPercentage: true, taxable: true },
    ])

    expect(result.MntNeto).toBe(8810)
    expect(result.IVA).toBe(1674)
    expect(result.MntTotal).toBe(10484)
  })

  it('aplica descuento en pesos sobre neto', () => {
    const totales = {
      MntNeto: 10000,
      MntExe: 0,
      TasaIVA: 19,
      IVA: 1900,
      MntTotal: 11900,
    }

    const result = applyGlobalDiscounts(totales, [
      { amount: 1000, isPercentage: false, taxable: true },
    ])

    expect(result.MntNeto).toBe(9000)
    expect(result.IVA).toBe(1710)
    expect(result.MntTotal).toBe(10710)
  })

  it('aplica múltiples descuentos', () => {
    const totales = {
      MntNeto: 10000,
      MntExe: 0,
      TasaIVA: 19,
      IVA: 1900,
      MntTotal: 11900,
    }

    const result = applyGlobalDiscounts(totales, [
      { amount: 10, isPercentage: true, taxable: true },
      { amount: 500, isPercentage: false, taxable: true },
    ])

    expect(result.MntNeto).toBe(8310)
    expect(result.IVA).toBe(1579)
    expect(result.MntTotal).toBe(9889)
  })

  it('aplica descuento sobre exento', () => {
    const totales = {
      MntNeto: 0,
      MntExe: 10000,
      TasaIVA: 19,
      IVA: 0,
      MntTotal: 10000,
    }

    const result = applyGlobalDiscounts(totales, [
      { amount: 1000, isPercentage: false, taxable: false },
    ])

    expect(result.MntNeto).toBe(0)
    expect(result.MntExe).toBe(9000)
    expect(result.IVA).toBe(0)
    expect(result.MntTotal).toBe(9000)
  })
})
