// Ejemplo: Crear una Factura Electrónica (tipo 33)

import { DTEBuilder } from '../src/sii'

const factura = new DTEBuilder()
  .setTipo(33) // Factura Electrónica
  .setFolio(12345)
  .setFechaEmision('2024-11-08')
  .setFormaPago(1) // Contado
  .setEmisor({
    rut: '76123456-7',
    razonSocial: 'MI EMPRESA DEMO LTDA',
    giro: 'Servicios de Tecnología',
    acteco: [620200],
    direccion: 'Av. Providencia 123',
    comuna: 'Providencia',
    ciudad: 'Santiago',
    correo: 'ventas@miempresa.cl',
  })
  .setReceptor({
    rut: '77654321-8',
    razonSocial: 'CLIENTE EJEMPLO SPA',
    giro: 'Comercio al por menor',
    direccion: 'Calle Falsa 456',
    comuna: 'Santiago',
    correo: 'contacto@cliente.cl',
  })
  .addItem({
    nombre: 'Desarrollo de Software',
    descripcion: 'Desarrollo de aplicación web personalizada',
    cantidad: 10,
    precio: 50000,
    unidad: 'HRS',
  })
  .addItem({
    nombre: 'Consultoría Técnica',
    cantidad: 5,
    precio: 80000,
    unidad: 'HRS',
  })
  .addItem({
    nombre: 'Hosting Anual',
    monto: 120000,
  })
  .calcularTotales() // Calcula automáticamente neto, IVA y total
  .build()

console.log(JSON.stringify(factura, null, 2))

/*
Resultado:
{
  "Encabezado": {
    "IdDoc": {
      "TipoDTE": 33,
      "Folio": 12345,
      "FchEmis": "2024-11-08",
      "FmaPago": 1
    },
    "Emisor": {
      "RUTEmisor": "76123456-7",
      "RznSoc": "MI EMPRESA DEMO LTDA",
      "GiroEmis": "Servicios de Tecnología",
      "Acteco": [620200],
      "DirOrigen": "Av. Providencia 123",
      "CmnaOrigen": "Providencia",
      "CdadOrigen": "Santiago",
      "CorreoEmisor": "ventas@miempresa.cl"
    },
    "Receptor": {
      "RUTRecep": "77654321-8",
      "RznSocRecep": "CLIENTE EJEMPLO SPA",
      "DirRecep": "Calle Falsa 456",
      "GiroRecep": "Comercio al por menor",
      "CmnaRecep": "Santiago",
      "CorreoRecep": "contacto@cliente.cl"
    },
    "Totales": {
      "MntNeto": 1020000,
      "TasaIVA": 19,
      "IVA": 193800,
      "MntTotal": 1213800
    }
  },
  "Detalle": [
    {
      "NroLinDet": 1,
      "NmbItem": "Desarrollo de Software",
      "MontoItem": 500000,
      "DscItem": "Desarrollo de aplicación web personalizada",
      "QtyItem": 10,
      "PrcItem": 50000,
      "UnmdItem": "HRS"
    },
    {
      "NroLinDet": 2,
      "NmbItem": "Consultoría Técnica",
      "MontoItem": 400000,
      "QtyItem": 5,
      "PrcItem": 80000,
      "UnmdItem": "HRS"
    },
    {
      "NroLinDet": 3,
      "NmbItem": "Hosting Anual",
      "MontoItem": 120000
    }
  ]
}
*/
