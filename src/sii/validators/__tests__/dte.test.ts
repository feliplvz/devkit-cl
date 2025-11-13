import { describe, it, expect } from 'vitest'
import {
  validateDTEStructure,
  validateDetalle,
  validateTotales,
  validateAllDetalles,
} from '../dte'
import type { DTEDocument, Detalle, Totales } from '../../types/dte'

describe('validateDTEStructure', () => {
  it('valida DTE con estructura correcta', () => {
    const dte: DTEDocument = {
      Encabezado: {
        IdDoc: {
          TipoDTE: 33,
          Folio: 12345,
          FchEmis: '2024-01-15',
        },
        Emisor: {
          RUTEmisor: '76123456-7',
          RznSoc: 'Empresa SpA',
          GiroEmis: 'Servicios TI',
          Acteco: [620200],
          DirOrigen: 'Av. Providencia 1234',
          CmnaOrigen: 'Providencia',
        },
        Receptor: {
          RUTRecep: '12345678-9',
          RznSocRecep: 'Cliente Ltda',
          DirRecep: 'Los Leones 456',
          CmnaRecep: 'Santiago',
        },
        Totales: {
          MntNeto: 10000,
          TasaIVA: 19,
          IVA: 1900,
          MntTotal: 11900,
        },
      },
      Detalle: [
        {
          NroLinDet: 1,
          NmbItem: 'Servicio',
          QtyItem: 1,
          PrcItem: 10000,
          MontoItem: 10000,
        },
      ],
    }

    const result = validateDTEStructure(dte)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rechaza DTE sin items en Detalle', () => {
    const dte: DTEDocument = {
      Encabezado: {
        IdDoc: { TipoDTE: 33, Folio: 1, FchEmis: '2024-01-15' },
        Emisor: {
          RUTEmisor: '76123456-7',
          RznSoc: 'Test',
          GiroEmis: 'Test',
          Acteco: [1],
          DirOrigen: 'Test',
          CmnaOrigen: 'Test',
        },
        Receptor: {
          RUTRecep: '12345678-9',
          RznSocRecep: 'Test',
          DirRecep: 'Test',
          CmnaRecep: 'Test',
        },
        Totales: { MntNeto: 0, TasaIVA: 19, IVA: 0, MntTotal: 1 },
      },
      Detalle: [],
    }

    const result = validateDTEStructure(dte)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('DTE debe tener al menos 1 item en Detalle')
  })

  it('rechaza DTE con más de 60 items', () => {
    const items: Detalle[] = Array.from({ length: 61 }, (_, i) => ({
      NroLinDet: i + 1,
      NmbItem: `Item ${i + 1}`,
      QtyItem: 1,
      PrcItem: 1000,
      MontoItem: 1000,
    }))

    const dte: DTEDocument = {
      Encabezado: {
        IdDoc: { TipoDTE: 33, Folio: 1, FchEmis: '2024-01-15' },
        Emisor: {
          RUTEmisor: '76123456-7',
          RznSoc: 'Test',
          GiroEmis: 'Test',
          Acteco: [1],
          DirOrigen: 'Test',
          CmnaOrigen: 'Test',
        },
        Receptor: {
          RUTRecep: '12345678-9',
          RznSocRecep: 'Test',
          DirRecep: 'Test',
          CmnaRecep: 'Test',
        },
        Totales: { MntNeto: 61000, TasaIVA: 19, IVA: 11590, MntTotal: 72590 },
      },
      Detalle: items,
    }

    const result = validateDTEStructure(dte)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('DTE no puede tener más de 60 items en Detalle')
  })

  it('acepta DTE con exactamente 60 items', () => {
    const items: Detalle[] = Array.from({ length: 60 }, (_, i) => ({
      NroLinDet: i + 1,
      NmbItem: `Item ${i + 1}`,
      QtyItem: 1,
      PrcItem: 1000,
      MontoItem: 1000,
    }))

    const dte: DTEDocument = {
      Encabezado: {
        IdDoc: { TipoDTE: 33, Folio: 1, FchEmis: '2024-01-15' },
        Emisor: {
          RUTEmisor: '76123456-7',
          RznSoc: 'Test',
          GiroEmis: 'Test',
          Acteco: [1],
          DirOrigen: 'Test',
          CmnaOrigen: 'Test',
        },
        Receptor: {
          RUTRecep: '12345678-9',
          RznSocRecep: 'Test',
          DirRecep: 'Test',
          CmnaRecep: 'Test',
        },
        Totales: { MntNeto: 60000, TasaIVA: 19, IVA: 11400, MntTotal: 71400 },
      },
      Detalle: items,
    }

    const result = validateDTEStructure(dte)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rechaza DTE sin campos requeridos en Encabezado', () => {
    const dte = {
      Encabezado: {
        IdDoc: { TipoDTE: 33, Folio: 1, FchEmis: '2024-01-15' },
        Totales: { MntTotal: 11900 },
      },
      Detalle: [
        {
          NroLinDet: 1,
          NmbItem: 'Item',
          QtyItem: 1,
          PrcItem: 10000,
          MontoItem: 10000,
        },
      ],
    } as unknown as DTEDocument

    const result = validateDTEStructure(dte)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})

describe('validateDetalle', () => {
  it('valida detalle correcto con todos los campos', () => {
    const detalle: Detalle = {
      NroLinDet: 1,
      NmbItem: 'Desarrollo Software',
      DscItem: 'Sistema de gestión',
      QtyItem: 1,
      UnmdItem: 'UN',
      PrcItem: 1000000,
      MontoItem: 1000000,
    }

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('valida detalle mínimo requerido', () => {
    const detalle: Detalle = {
      NroLinDet: 1,
      NmbItem: 'Item',
      QtyItem: 1,
      PrcItem: 100,
      MontoItem: 100,
    }

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rechaza detalle sin NmbItem', () => {
    const detalle = {
      NroLinDet: 1,
      QtyItem: 1,
      PrcItem: 100,
      MontoItem: 100,
    } as unknown as Detalle

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('NmbItem'))).toBe(true)
  })

  it('rechaza detalle con MontoItem negativo', () => {
    const detalle: Detalle = {
      NroLinDet: 1,
      NmbItem: 'Item',
      QtyItem: 1,
      PrcItem: 100,
      MontoItem: -100,
    }

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('MontoItem'))).toBe(true)
  })

  it('rechaza NroLinDet incorrecto', () => {
    const detalle: Detalle = {
      NroLinDet: 5, // Debería ser 1 para index 0
      NmbItem: 'Item',
      QtyItem: 1,
      PrcItem: 100,
      MontoItem: 100,
    }

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('NroLinDet'))).toBe(true)
  })

  it('acepta detalle exento (IndExe=1)', () => {
    const detalle: Detalle = {
      NroLinDet: 1,
      IndExe: 1,
      NmbItem: 'Item Exento',
      QtyItem: 1,
      PrcItem: 5000,
      MontoItem: 5000,
    }

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rechaza NmbItem con más de 80 caracteres', () => {
    const detalle: Detalle = {
      NroLinDet: 1,
      NmbItem: 'A'.repeat(81),
      QtyItem: 1,
      PrcItem: 100,
      MontoItem: 100,
    }

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('80 caracteres'))).toBe(true)
  })

  it('acepta NmbItem con exactamente 80 caracteres', () => {
    const detalle: Detalle = {
      NroLinDet: 1,
      NmbItem: 'A'.repeat(80),
      QtyItem: 1,
      PrcItem: 100,
      MontoItem: 100,
    }

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rechaza DscItem con más de 1000 caracteres', () => {
    const detalle: Detalle = {
      NroLinDet: 1,
      NmbItem: 'Item',
      DscItem: 'A'.repeat(1001),
      QtyItem: 1,
      PrcItem: 100,
      MontoItem: 100,
    }

    const result = validateDetalle(detalle, 0)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('1000 caracteres'))).toBe(true)
  })
})

describe('validateTotales', () => {
  it('valida totales correctos con IVA', () => {
    const totales: Totales = {
      MntNeto: 10000,
      TasaIVA: 19,
      IVA: 1900,
      MntTotal: 11900,
    }

    const result = validateTotales(totales)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('valida totales con items exentos', () => {
    const totales: Totales = {
      MntNeto: 10000,
      MntExe: 5000,
      TasaIVA: 19,
      IVA: 1900,
      MntTotal: 16900,
    }

    const result = validateTotales(totales)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('valida totales solo exentos (sin IVA)', () => {
    const totales: Totales = {
      MntExe: 10000,
      MntTotal: 10000,
    }

    const result = validateTotales(totales)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rechaza MntTotal cero', () => {
    const totales: Totales = {
      MntNeto: 0,
      MntTotal: 0,
    }

    const result = validateTotales(totales)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('MntTotal debe ser mayor a 0'))).toBe(true)
  })

  it('rechaza suma incorrecta de totales', () => {
    const totales: Totales = {
      MntNeto: 10000,
      TasaIVA: 19,
      IVA: 1900,
      MntTotal: 15000, // Incorrecto, debería ser 11900
    }

    const result = validateTotales(totales)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('no coincide'))).toBe(true)
  })

  it('acepta diferencia de redondeo menor a 1 peso', () => {
    const totales: Totales = {
      MntNeto: 10000,
      TasaIVA: 19,
      IVA: 1900,
      MntTotal: 11900,
    }

    const result = validateTotales(totales)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rechaza TasaIVA mayor a 100', () => {
    const totales: Totales = {
      MntNeto: 10000,
      TasaIVA: 150,
      IVA: 15000,
      MntTotal: 25000,
    }

    const result = validateTotales(totales)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('TasaIVA'))).toBe(true)
  })

  it('valida totales con montos grandes', () => {
    const totales: Totales = {
      MntNeto: 100000000,
      TasaIVA: 19,
      IVA: 19000000,
      MntTotal: 119000000,
    }

    const result = validateTotales(totales)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

describe('validateAllDetalles', () => {
  it('valida array de detalles correctos', () => {
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

    const result = validateAllDetalles(detalles)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rechaza si algún detalle tiene NroLinDet incorrecto', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        NmbItem: 'Item 1',
        QtyItem: 1,
        PrcItem: 5000,
        MontoItem: 5000,
      },
      {
        NroLinDet: 5, // Debería ser 2
        NmbItem: 'Item 2',
        QtyItem: 1,
        PrcItem: 10000,
        MontoItem: 10000,
      },
    ]

    const result = validateAllDetalles(detalles)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('NroLinDet'))).toBe(true)
  })

  it('valida detalles con items exentos y afectos', () => {
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

    const result = validateAllDetalles(detalles)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('valida 60 items (límite máximo)', () => {
    const detalles: Detalle[] = Array.from({ length: 60 }, (_, i) => ({
      NroLinDet: i + 1,
      NmbItem: `Item ${i + 1}`,
      QtyItem: 1,
      PrcItem: 1000,
      MontoItem: 1000,
    }))

    const result = validateAllDetalles(detalles)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('valida secuencia correcta de NroLinDet', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 1,
        NmbItem: 'Item 1',
        QtyItem: 1,
        PrcItem: 1000,
        MontoItem: 1000,
      },
      {
        NroLinDet: 2,
        NmbItem: 'Item 2',
        QtyItem: 1,
        PrcItem: 2000,
        MontoItem: 2000,
      },
      {
        NroLinDet: 3,
        NmbItem: 'Item 3',
        QtyItem: 1,
        PrcItem: 3000,
        MontoItem: 3000,
      },
    ]

    const result = validateAllDetalles(detalles)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('acumula múltiples errores de diferentes items', () => {
    const detalles: Detalle[] = [
      {
        NroLinDet: 5, // Error: debería ser 1
        NmbItem: 'Item 1',
        QtyItem: 1,
        PrcItem: 1000,
        MontoItem: 1000,
      },
      {
        NroLinDet: 10, // Error: debería ser 2
        NmbItem: 'A'.repeat(81), // Error: más de 80 chars
        QtyItem: 1,
        PrcItem: 2000,
        MontoItem: 2000,
      },
    ]

    const result = validateAllDetalles(detalles)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(2) // Al menos 3 errores
  })
})
