import { describe, it, expect } from 'vitest'
import {
  calculateIVA,
  calculateNeto,
  calculateTotal,
  extractIVA,
  isNetoValid,
  isTotalValid,
} from '../iva'

describe('calculateIVA', () => {
  it('calcula IVA correctamente con tasa por defecto (19%)', () => {
    expect(calculateIVA(10000)).toBe(1900)
    expect(calculateIVA(50000)).toBe(9500)
    expect(calculateIVA(100000)).toBe(19000)
  })

  it('calcula IVA con tasas personalizadas', () => {
    expect(calculateIVA(10000, 10)).toBe(1000)
    expect(calculateIVA(10000, 15)).toBe(1500)
    expect(calculateIVA(10000, 21)).toBe(2100)
  })

  it('maneja montos pequeños sin errores de redondeo', () => {
    expect(calculateIVA(1)).toBe(0)
    expect(calculateIVA(10)).toBe(2)
    expect(calculateIVA(100)).toBe(19)
  })

  it('maneja montos grandes', () => {
    expect(calculateIVA(1000000)).toBe(190000)
    expect(calculateIVA(10000000)).toBe(1900000)
    expect(calculateIVA(100000000)).toBe(19000000)
  })

  it('redondea correctamente valores intermedios', () => {
    expect(calculateIVA(10001)).toBe(1900)
    expect(calculateIVA(10005)).toBe(1901)
    expect(calculateIVA(10010)).toBe(1902)
  })
})

describe('calculateNeto', () => {
  it('calcula neto desde total correctamente', () => {
    expect(calculateNeto(11900)).toBe(10000)
    expect(calculateNeto(59500)).toBe(50000)
    expect(calculateNeto(119000)).toBe(100000)
  })

  it('calcula neto con tasas personalizadas', () => {
    expect(calculateNeto(11000, 10)).toBe(10000)
    expect(calculateNeto(11500, 15)).toBe(10000)
    expect(calculateNeto(12100, 21)).toBe(10000)
  })

  it('maneja valores pequeños', () => {
    expect(calculateNeto(1)).toBe(1)
    expect(calculateNeto(119)).toBe(100)
  })

  it('maneja valores grandes', () => {
    expect(calculateNeto(1190000)).toBe(1000000)
    expect(calculateNeto(11900000)).toBe(10000000)
  })

  it('es inverso de calculateTotal', () => {
    const neto = 12345
    const total = calculateTotal(neto)
    expect(calculateNeto(total)).toBe(neto)
  })
})

describe('calculateTotal', () => {
  it('calcula total desde neto correctamente', () => {
    expect(calculateTotal(10000)).toBe(11900)
    expect(calculateTotal(50000)).toBe(59500)
    expect(calculateTotal(100000)).toBe(119000)
  })

  it('calcula total con tasas personalizadas', () => {
    expect(calculateTotal(10000, 10)).toBe(11000)
    expect(calculateTotal(10000, 15)).toBe(11500)
    expect(calculateTotal(10000, 21)).toBe(12100)
  })

  it('maneja valores pequeños', () => {
    expect(calculateTotal(1)).toBe(1)
    expect(calculateTotal(100)).toBe(119)
  })

  it('maneja valores grandes', () => {
    expect(calculateTotal(1000000)).toBe(1190000)
    expect(calculateTotal(10000000)).toBe(11900000)
  })

  it('es inverso de calculateNeto', () => {
    const total = 98765
    const neto = calculateNeto(total)
    expect(calculateTotal(neto)).toBe(total)
  })
})

describe('extractIVA', () => {
  it('extrae IVA desde total correctamente', () => {
    expect(extractIVA(11900)).toBe(1900)
    expect(extractIVA(59500)).toBe(9500)
    expect(extractIVA(119000)).toBe(19000)
  })

  it('extrae IVA con tasas personalizadas', () => {
    expect(extractIVA(11000, 10)).toBe(1000)
    expect(extractIVA(11500, 15)).toBe(1500)
    expect(extractIVA(12100, 21)).toBe(2100)
  })

  it('coincide con calculateIVA del neto', () => {
    const neto = 10000
    const ivaDirecto = calculateIVA(neto)
    const total = calculateTotal(neto)
    const ivaExtraido = extractIVA(total)
    
    expect(ivaExtraido).toBe(ivaDirecto)
  })

  it('maneja valores pequeños', () => {
    expect(extractIVA(119)).toBe(19)
    expect(extractIVA(238)).toBe(38)
  })

  it('maneja valores grandes', () => {
    expect(extractIVA(1190000)).toBe(190000)
    expect(extractIVA(11900000)).toBe(1900000)
  })
})

describe('isNetoValid', () => {
  it('valida combinaciones neto-IVA correctas', () => {
    expect(isNetoValid(10000, 1900)).toBe(true)
    expect(isNetoValid(50000, 9500)).toBe(true)
    expect(isNetoValid(100000, 19000)).toBe(true)
  })

  it('detecta combinaciones neto-IVA incorrectas', () => {
    expect(isNetoValid(10000, 1800)).toBe(false)
    expect(isNetoValid(10000, 2000)).toBe(false)
    expect(isNetoValid(50000, 9000)).toBe(false)
  })

  it('valida con tasas personalizadas', () => {
    expect(isNetoValid(10000, 1000, 10)).toBe(true)
    expect(isNetoValid(10000, 1500, 15)).toBe(true)
    expect(isNetoValid(10000, 1000, 15)).toBe(false)
  })

  it('calcula IVA correcto para validación', () => {
    expect(isNetoValid(10001, 1900)).toBe(true)
    expect(isNetoValid(10526, 2000)).toBe(true)
    expect(isNetoValid(10001, 1902)).toBe(false)
  })
})

describe('isTotalValid', () => {
  it('valida combinaciones neto-iva-total correctas', () => {
    expect(isTotalValid(10000, 1900, 11900)).toBe(true)
    expect(isTotalValid(50000, 9500, 59500)).toBe(true)
    expect(isTotalValid(100000, 19000, 119000)).toBe(true)
  })

  it('detecta combinaciones neto-iva-total incorrectas', () => {
    expect(isTotalValid(10000, 1900, 11800)).toBe(false)
    expect(isTotalValid(10000, 1900, 12000)).toBe(false)
    expect(isTotalValid(50000, 9500, 59000)).toBe(false)
  })

  it('valida suma exacta', () => {
    const neto = 12345
    const iva = calculateIVA(neto)
    const total = neto + iva
    expect(isTotalValid(neto, iva, total)).toBe(true)
  })

  it('detecta errores de suma', () => {
    expect(isTotalValid(10000, 1900, 11901)).toBe(false)
    expect(isTotalValid(10000, 1900, 11899)).toBe(false)
  })
})

describe('edge cases y precisión', () => {
  it('maneja montos con decimales (redondeados a enteros)', () => {
    expect(calculateIVA(10000.5)).toBe(1900)
    expect(calculateIVA(10000.9)).toBe(1900)
  })

  it('no pierde precisión en cálculos encadenados', () => {
    const original = 123456
    const conIVA = calculateTotal(original)
    const sinIVA = calculateNeto(conIVA)
    const iva = extractIVA(conIVA)
    
    expect(sinIVA).toBe(original)
    expect(sinIVA + iva).toBe(conIVA)
  })

  it('funciona con montos de 0', () => {
    expect(calculateIVA(0)).toBe(0)
    expect(calculateNeto(0)).toBe(0)
    expect(calculateTotal(0)).toBe(0)
    expect(extractIVA(0)).toBe(0)
  })

  it('redondea consistentemente en límites', () => {
    // 10000 * 0.19 = 1900 exacto
    expect(calculateIVA(10000)).toBe(1900)
    
    // 10526 * 0.19 = 1999.94 → redondea a 2000
    expect(calculateIVA(10526)).toBe(2000)
    
    // 10527 * 0.19 = 2000.13 → redondea a 2000
    expect(calculateIVA(10527)).toBe(2000)
  })
})
