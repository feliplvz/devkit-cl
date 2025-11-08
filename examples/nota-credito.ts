// Ejemplo: Nota de Crédito con Referencias

import { DTEBuilder } from '../src/sii'

const notaCredito = new DTEBuilder()
  .setTipo(61) // Nota de Crédito
  .setFolio(555)
  .setFechaEmision('2024-11-08')
  .setEmisor({
    rut: '76123456-7',
    razonSocial: 'MI EMPRESA DEMO LTDA',
    giro: 'Servicios de Tecnología',
    acteco: [620200],
    direccion: 'Av. Providencia 123',
    comuna: 'Providencia',
  })
  .setReceptor({
    rut: '77654321-8',
    razonSocial: 'CLIENTE EJEMPLO SPA',
    direccion: 'Calle Falsa 456',
    comuna: 'Santiago',
  })
  .addReferencia({
    tipoDoc: '33', // Referencia a Factura
    folio: '12345',
    fecha: '2024-11-01',
    codigo: 1, // Anula documento
    razon: 'Devolución de mercadería',
  })
  .addItem({
    nombre: 'Devolución: Desarrollo de Software',
    cantidad: 2,
    precio: 50000,
  })
  .calcularTotales()
  .build()

console.log(JSON.stringify(notaCredito, null, 2))
