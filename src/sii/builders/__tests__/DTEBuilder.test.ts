import { describe, it, expect } from 'vitest'
import { DTEBuilder } from '../DTEBuilder'

describe('DTEBuilder', () => {
  describe('Factura básica', () => {
    it('construye factura completa con fluent API', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
        .setFolio(12345)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Empresa SpA',
          giro: 'Servicios TI',
          acteco: [620200],
          direccion: 'Av. Providencia 1234',
          comuna: 'Providencia',
        })
        .setReceptor({
          rut: '12345678-9',
          razonSocial: 'Cliente Ltda',
          direccion: 'Los Leones 456',
          comuna: 'Santiago',
        })
        .addItem({
          nombre: 'Desarrollo Software',
          cantidad: 1,
          precio: 1000000,
        })
        .calcularTotales().build()

      expect(dte.Encabezado.IdDoc.TipoDTE).toBe(33)
      expect(dte.Encabezado.IdDoc.Folio).toBe(12345)
      expect(dte.Encabezado.Emisor.RUTEmisor).toBe('76123456-7')
      expect(dte.Encabezado.Receptor.RUTRecep).toBe('12345678-9')
      expect(dte.Detalle).toHaveLength(1)
      expect(dte.Detalle[0].NmbItem).toBe('Desarrollo Software')
      expect(dte.Encabezado.Totales.MntNeto).toBe(1000000)
      expect(dte.Encabezado.Totales.IVA).toBe(190000)
      expect(dte.Encabezado.Totales.MntTotal).toBe(1190000)
    })

    it('calcula totales automáticamente con múltiples items', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Item 1', cantidad: 2, precio: 5000 })
        .addItem({ nombre: 'Item 2', cantidad: 1, precio: 10000 })
        .calcularTotales().build()

      expect(dte.Detalle).toHaveLength(2)
      expect(dte.Detalle[0].MontoItem).toBe(10000)
      expect(dte.Detalle[1].MontoItem).toBe(10000)
      expect(dte.Encabezado.Totales.MntNeto).toBe(20000)
      expect(dte.Encabezado.Totales.IVA).toBe(3800)
      expect(dte.Encabezado.Totales.MntTotal).toBe(23800)
    })

    it('numera items automáticamente', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Item 1', cantidad: 1, precio: 100 })
        .addItem({ nombre: 'Item 2', cantidad: 1, precio: 200 })
        .addItem({ nombre: 'Item 3', cantidad: 1, precio: 300 })
        .calcularTotales().build()

      expect(dte.Detalle[0].NroLinDet).toBe(1)
      expect(dte.Detalle[1].NroLinDet).toBe(2)
      expect(dte.Detalle[2].NroLinDet).toBe(3)
    })

    it('valida campos requeridos al construir', () => {
      const builder = new DTEBuilder()

      expect(() => builder.calcularTotales().build()).toThrow()
    })
  })

  describe('Items exentos', () => {
    it('maneja items exentos correctamente', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({
          nombre: 'Libro (exento)',
          cantidad: 1,
          precio: 15000,
          exento: true,
        })
        .calcularTotales().build()

      expect(dte.Detalle[0].IndExe).toBe(1)
      expect(dte.Encabezado.Totales.MntExe).toBe(15000)
      expect(dte.Encabezado.Totales.MntNeto).toBeUndefined()
      expect(dte.Encabezado.Totales.IVA).toBeUndefined()
      expect(dte.Encabezado.Totales.MntTotal).toBe(15000)
    })

    it('combina items afectos y exentos', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Software', cantidad: 1, precio: 10000 })
        .addItem({
          nombre: 'Libro',
          cantidad: 1,
          precio: 5000,
          exento: true,
        })
        .calcularTotales().build()

      expect(dte.Detalle).toHaveLength(2)
      expect(dte.Detalle[0].IndExe).toBeUndefined()
      expect(dte.Detalle[1].IndExe).toBe(1)
      expect(dte.Encabezado.Totales.MntNeto).toBe(10000)
      expect(dte.Encabezado.Totales.MntExe).toBe(5000)
      expect(dte.Encabezado.Totales.IVA).toBe(1900)
      expect(dte.Encabezado.Totales.MntTotal).toBe(16900)
    })
  })

  describe('Descuentos globales', () => {
    it('aplica descuento porcentual global', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Item', cantidad: 1, precio: 10000 })
        .addDescuentoGlobal({
          tipo: 'D',
          valor: 10,
          esPorcentaje: true,
        })
        .calcularTotales().build()

      expect(dte.DscRcgGlobal).toHaveLength(1)
      expect(dte.DscRcgGlobal![0].TpoMov).toBe('D')
      expect(dte.DscRcgGlobal![0].TpoValor).toBe('%')
      expect(dte.DscRcgGlobal![0].ValorDR).toBe(10)
      expect(dte.Encabezado.Totales.MntNeto).toBe(9000)
      expect(dte.Encabezado.Totales.IVA).toBe(1710)
      expect(dte.Encabezado.Totales.MntTotal).toBe(10710)
    })

    it('aplica descuento monto fijo global', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Item', cantidad: 1, precio: 10000 })
        .addDescuentoGlobal({
          tipo: 'D',
          valor: 1000,
          esPorcentaje: false,
        })
        .calcularTotales().build()

      expect(dte.DscRcgGlobal![0].TpoValor).toBe('$')
      expect(dte.DscRcgGlobal![0].ValorDR).toBe(1000)
      expect(dte.Encabezado.Totales.MntNeto).toBe(9000)
    })

    it('aplica recargo global', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Item', cantidad: 1, precio: 10000 })
        .addDescuentoGlobal({
          tipo: 'R',
          valor: 5,
          esPorcentaje: true,
        })
        .calcularTotales().build()

      expect(dte.DscRcgGlobal![0].TpoMov).toBe('R')
      expect(dte.Encabezado.Totales.MntNeto).toBe(10500)
    })

    it('aplica múltiples descuentos/recargos', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Item', cantidad: 1, precio: 10000 })
        .addDescuentoGlobal({
          tipo: 'D',
          valor: 10,
          esPorcentaje: true,
        })
        .addDescuentoGlobal({
          tipo: 'R',
          valor: 500,
          esPorcentaje: false,
        })
        .calcularTotales().build()

      expect(dte.DscRcgGlobal).toHaveLength(2)
      expect(dte.Encabezado.Totales.MntNeto).toBe(9500)
    })
  })

  describe('Cantidades decimales', () => {
    it('maneja cantidades decimales correctamente', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Servicio', cantidad: 2.5, precio: 1000 })
        .calcularTotales().build()

      expect(dte.Detalle[0].QtyItem).toBe(2.5)
      expect(dte.Detalle[0].MontoItem).toBe(2500)
      expect(dte.Encabezado.Totales.MntNeto).toBe(2500)
    })
  })

  describe('Referencias', () => {
    it('agrega referencia a otro documento', () => {
      const dte = new DTEBuilder()
        .setTipo(61) // Nota de crédito
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Item', cantidad: 1, precio: 1000 })
        .addReferencia({
          tipoDoc: '33',
          folio: '12345',
          fecha: '2024-01-10',
          codigo: 1, // Anula documento de referencia
        })
        .calcularTotales().build()

      expect(dte.Referencia).toHaveLength(1)
      expect(dte.Referencia![0].TpoDocRef).toBe('33')
      expect(dte.Referencia![0].FolioRef).toBe('12345')
      expect(dte.Referencia![0].FchRef).toBe('2024-01-10')
      expect(dte.Referencia![0].CodRef).toBe(1)
    })

    it('agrega múltiples referencias', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Item', cantidad: 1, precio: 1000 })
        .addReferencia({
          tipoDoc: '33',
          folio: '100',
          fecha: '2024-01-01',
        })
        .addReferencia({
          tipoDoc: '33',
          folio: '200',
          fecha: '2024-01-05',
        })
        .calcularTotales().build()

      expect(dte.Referencia).toHaveLength(2)
      expect(dte.Referencia![0].FolioRef).toBe('100')
      expect(dte.Referencia![1].FolioRef).toBe('200')
    })
  })

  describe('Escenarios reales', () => {
    it('factura software con hosting y libro exento', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
        .setFolio(12345)
        .setFechaEmision('2024-01-15')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'TechCorp SpA',
          giro: 'Desarrollo Software',
          acteco: [620200],
          direccion: 'Av. Providencia 1234',
          comuna: 'Providencia',
        })
        .setReceptor({
          rut: '12345678-9',
          razonSocial: 'Cliente Enterprise Ltda',
          direccion: 'Los Leones 456',
          comuna: 'Santiago',
        })
        .addItem({
          nombre: 'Desarrollo Sistema CRM',
          descripcion: 'Sistema personalizado de gestión',
          cantidad: 1,
          precio: 1000000,
        })
        .addItem({
          nombre: 'Hosting Cloud 1 año',
          cantidad: 12,
          precio: 5000,
        })
        .addItem({
          nombre: 'Libro: Clean Code',
          cantidad: 3,
          precio: 15000,
          exento: true,
        })
        .addDescuentoGlobal({
          tipo: 'D',
          valor: 5,
          esPorcentaje: true,
          glosa: 'Descuento cliente frecuente',
        })
        .calcularTotales().build()

      expect(dte.Detalle).toHaveLength(3)
      expect(dte.Detalle[0].DscItem).toBe('Sistema personalizado de gestión')
      expect(dte.Detalle[2].IndExe).toBe(1)
      expect(dte.DscRcgGlobal).toHaveLength(1)
      expect(dte.Encabezado.Totales.MntExe).toBe(45000)
      expect(dte.Encabezado.Totales.MntNeto).toBe(1007000) // (1000000 + 60000) * 0.95
      expect(dte.Encabezado.Totales.MntTotal).toBe(1243330) // 1007000 + 190330 + 45000
    })
  })

  describe('Edge cases', () => {
    it('maneja precio cero correctamente', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
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
          rut: '12345678-9',
          razonSocial: 'Test',
          direccion: 'Test',
          comuna: 'Test',
        })
        .addItem({ nombre: 'Muestra gratis', cantidad: 1, precio: 0 })
        .addItem({ nombre: 'Item normal', cantidad: 1, precio: 1000 })
        .calcularTotales().build()

      expect(dte.Detalle[0].MontoItem).toBe(0)
      expect(dte.Encabezado.Totales.MntNeto).toBe(1000)
    })

    it('construye DTE con método encadenado completo', () => {
      const dte = new DTEBuilder()
        .setTipo(33)
        .setFolio(999)
        .setFechaEmision('2024-12-31')
        .setEmisor({
          rut: '76123456-7',
          razonSocial: 'Empresa',
          giro: 'Comercio',
          acteco: [1],
          direccion: 'Calle 123',
          comuna: 'Santiago',
        })
        .setReceptor({
          rut: '12345678-9',
          razonSocial: 'Cliente',
          direccion: 'Calle 456',
          comuna: 'Providencia',
        })
        .addItem({ nombre: 'A', cantidad: 1, precio: 100 })
        .addItem({ nombre: 'B', cantidad: 2, precio: 200 })
        .addItem({ nombre: 'C', cantidad: 3, precio: 300, exento: true })
        .addDescuentoGlobal({ tipo: 'D', valor: 10, esPorcentaje: true })
        .addReferencia({ tipoDoc: '33', folio: '888', fecha: '2024-12-01' })
        .calcularTotales().build()

      expect(dte.Encabezado.IdDoc.Folio).toBe(999)
      expect(dte.Detalle).toHaveLength(3)
      expect(dte.DscRcgGlobal).toHaveLength(1)
      expect(dte.Referencia).toHaveLength(1)
      expect(dte.Encabezado.Totales.MntTotal).toBeGreaterThan(0)
    })
  })
})
