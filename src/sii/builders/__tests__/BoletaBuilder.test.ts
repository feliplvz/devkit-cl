import { describe, it, expect } from 'vitest'
import { BoletaBuilder } from '../BoletaBuilder'

describe('BoletaBuilder', () => {
  describe('Boleta básica', () => {
    it('construye boleta electrónica simple', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(12345)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Comercial SpA',
          giro: 'Venta retail',
          acteco: [521010],
          direccion: 'Mall Plaza 123',
          comuna: 'Santiago',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addItem({
          nombre: 'Producto',
          cantidad: 1,
          precio: 10000,
        })
        .build()

      expect(boleta.Encabezado.IdDoc.TipoDTE).toBe(39) // Boleta electrónica
      expect(boleta.Encabezado.IdDoc.Folio).toBe(12345)
      expect(boleta.Detalle).toHaveLength(1)
      expect(boleta.Encabezado.Totales.MntTotal).toBe(10000) // Boletas incluyen IVA
    })

    it('construye boleta exenta', () => {
      const boleta = new BoletaBuilder()
        .exenta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Comercial',
          giro: 'Venta',
          acteco: [1],
          direccion: 'Calle 123',
          comuna: 'Santiago',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addItem({ nombre: 'Producto exento', cantidad: 1, precio: 5000 })
        .build()

      expect(boleta.Encabezado.IdDoc.TipoDTE).toBe(41) // Boleta exenta
      expect(boleta.Encabezado.Totales.MntExe).toBe(5000)
      expect(boleta.Encabezado.Totales.MntTotal).toBe(5000)
    })

    it('calcula totales automáticamente con múltiples items', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test',
          giro: 'Test',
          acteco: [1],
          direccion: 'Test',
          comuna: 'Test',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addItem({ nombre: 'Item 1', cantidad: 2, precio: 1000 })
        .addItem({ nombre: 'Item 2', cantidad: 3, precio: 2000 })
        .build()

      expect(boleta.Detalle).toHaveLength(2)
      expect(boleta.Detalle[0].MontoItem).toBe(2000)
      expect(boleta.Detalle[1].MontoItem).toBe(6000)
      expect(boleta.Encabezado.Totales.MntTotal).toBe(8000)
    })

    it('numera items automáticamente', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test',
          giro: 'Test',
          acteco: [1],
          direccion: 'Test',
          comuna: 'Test',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addItem({ nombre: 'A', cantidad: 1, precio: 100 })
        .addItem({ nombre: 'B', cantidad: 1, precio: 200 })
        .addItem({ nombre: 'C', cantidad: 1, precio: 300 })
        .build()

      expect(boleta.Detalle[0].NroLinDet).toBe(1)
      expect(boleta.Detalle[1].NroLinDet).toBe(2)
      expect(boleta.Detalle[2].NroLinDet).toBe(3)
    })
  })

  describe('Métodos simplificados', () => {
    it('usa addProducto para agregar productos rápidamente', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test',
          giro: 'Test',
          acteco: [1],
          direccion: 'Test',
          comuna: 'Test',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addProducto('Leche', 2, 950)
        .addProducto('Pan', 4, 1200)
        .build()

      expect(boleta.Detalle).toHaveLength(2)
      expect(boleta.Detalle[0].NmbItem).toBe('Leche')
      expect(boleta.Detalle[0].QtyItem).toBe(2)
      expect(boleta.Detalle[0].MontoItem).toBe(1900)
      expect(boleta.Detalle[1].MontoItem).toBe(4800)
    })

    it('usa addServicio para agregar servicios', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test',
          giro: 'Test',
          acteco: [1],
          direccion: 'Test',
          comuna: 'Test',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addServicio('Almuerzo Ejecutivo', 8500)
        .addServicio('Café', 1500)
        .build()

      expect(boleta.Detalle).toHaveLength(2)
      expect(boleta.Detalle[0].QtyItem).toBe(1)
      expect(boleta.Detalle[0].MontoItem).toBe(8500)
      expect(boleta.Detalle[1].MontoItem).toBe(1500)
    })
  })

  describe('Escenarios reales', () => {
    it('boleta supermercado con múltiples productos', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(98765)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Supermercado Los Andes',
          giro: 'Venta retail',
          acteco: [521010],
          direccion: 'Av. Apoquindo 4500',
          comuna: 'Las Condes',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addProducto('Leche 1L', 2, 950)
        .addProducto('Pan Hallulla', 4, 1200)
        .addProducto('Café 500g', 1, 4500)
        .addProducto('Arroz 1kg', 3, 1100)
        .build()

      expect(boleta.Detalle).toHaveLength(4)
      expect(boleta.Encabezado.Totales.MntTotal).toBe(14500) // 1900 + 4800 + 4500 + 3300
      expect(boleta.Encabezado.IdDoc.TipoDTE).toBe(39)
    })

    it('boleta restaurante con servicios', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(456)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Restaurante El Buen Sabor',
          giro: 'Servicios de alimentación',
          acteco: [561000],
          direccion: 'Lastarria 123',
          comuna: 'Santiago',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addServicio('Almuerzo Ejecutivo x2', 17000)
        .addServicio('Bebida x2', 4000)
        .addServicio('Café x2', 3000)
        .build()

      expect(boleta.Detalle).toHaveLength(3)
      expect(boleta.Encabezado.Totales.MntTotal).toBe(24000)
    })

    it('boleta farmacia con productos exentos', () => {
      const boleta = new BoletaBuilder()
        .exenta()
        .setFolio(789)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Farmacia Cruz Verde',
          giro: 'Venta farmacéutica',
          acteco: [477310],
          direccion: 'Providencia 2500',
          comuna: 'Providencia',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addProducto('Paracetamol 500mg', 1, 3500)
        .addProducto('Ibuprofeno 400mg', 2, 4200)
        .build()

      expect(boleta.Encabezado.IdDoc.TipoDTE).toBe(41) // Boleta exenta
      expect(boleta.Encabezado.Totales.MntExe).toBe(11900)
      expect(boleta.Encabezado.Totales.MntTotal).toBe(11900)
    })

    it('boleta tienda retail con descuentos', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(55555)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Tienda Falabella',
          giro: 'Retail',
          acteco: [521010],
          direccion: 'Mall Plaza 456',
          comuna: 'Maipú',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addProducto('Polera', 2, 12990)
        .addProducto('Pantalón', 1, 29990)
        .addDescuentoGlobal({
          tipo: 'D',
          valor: 20,
          esPorcentaje: true,
          glosa: 'Descuento CyberDay',
        })
        .build()

      expect(boleta.DscRcgGlobal).toHaveLength(1)
      expect(boleta.DscRcgGlobal![0].TpoMov).toBe('D')
      expect(boleta.DscRcgGlobal![0].ValorDR).toBe(20)
      expect(boleta.Encabezado.Totales.MntTotal).toBeLessThan(55970) // Con descuento
    })
  })

  describe('Validación', () => {
    it('valida campos requeridos', () => {
      const builder = new BoletaBuilder()

      expect(() => builder.build()).toThrow()
    })

    it('acepta boleta mínima válida', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'T',
          giro: 'T',
          acteco: [1],
          direccion: 'T',
          comuna: 'T',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addItem({ nombre: 'I', cantidad: 1, precio: 1 })
        .build()

      expect(boleta.Encabezado.IdDoc.TipoDTE).toBe(39)
      expect(boleta.Detalle).toHaveLength(1)
    })
  })

  describe('Edge cases', () => {
    it('maneja cantidades decimales', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test',
          giro: 'Test',
          acteco: [1],
          direccion: 'Test',
          comuna: 'Test',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addProducto('Frutas kg', 1.5, 2000)
        .build()

      expect(boleta.Detalle[0].QtyItem).toBe(1.5)
      expect(boleta.Detalle[0].MontoItem).toBe(3000)
    })

    it('construye con método encadenado completo', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(9999)
        .setFechaEmision('2024-12-31')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test Corp',
          giro: 'Test',
          acteco: [999999],
          direccion: 'Test St 123',
          comuna: 'TestCity',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addProducto('A', 1, 1000)
        .addProducto('B', 2, 2000)
        .addServicio('C x3', 9000)
        .addDescuentoGlobal({ tipo: 'D', valor: 1000, esPorcentaje: false })
        .build()

      expect(boleta.Encabezado.IdDoc.Folio).toBe(9999)
      expect(boleta.Detalle).toHaveLength(3)
      expect(boleta.DscRcgGlobal).toHaveLength(1)
      expect(boleta.Encabezado.Totales.MntTotal).toBeGreaterThan(0)
    })

    it('alterna entre boleta normal y exenta', () => {
      const builder1 = new BoletaBuilder()
        .afecta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test',
          giro: 'Test',
          acteco: [1],
          direccion: 'Test',
          comuna: 'Test',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addItem({ nombre: 'Item', cantidad: 1, precio: 1000 })

      // Normal
      const normal = builder1.build()
      expect(normal.Encabezado.IdDoc.TipoDTE).toBe(39)

      // Exenta (nuevo builder)
      const builder2 = new BoletaBuilder()
        .exenta()
        .setFolio(2)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test',
          giro: 'Test',
          acteco: [1],
          direccion: 'Test',
          comuna: 'Test',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addItem({ nombre: 'Item', cantidad: 1, precio: 1000 })

      const exenta = builder2.build()
      expect(exenta.Encabezado.IdDoc.TipoDTE).toBe(41)
    })

    it('mezcla addProducto y addServicio', () => {
      const boleta = new BoletaBuilder()
        .afecta()
        .setFolio(1)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Test',
          giro: 'Test',
          acteco: [1],
          direccion: 'Test',
          comuna: 'Test',
        })
        .setReceptor({
          rut: '66666666-6',
          razonSocial: 'Cliente',
          direccion: 'Santiago',
          comuna: 'Santiago',
        })
        .addProducto('Producto', 1, 5000)
        .addServicio('Servicio', 3000)
        .addItem({ nombre: 'Manual', cantidad: 1, precio: 2000 })
        .build()

      expect(boleta.Detalle).toHaveLength(3)
      expect(boleta.Encabezado.Totales.MntTotal).toBe(10000)
    })
  })
})

