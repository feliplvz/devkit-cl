// Ejemplo: Crear una Boleta Electrónica (tipo 39)

import { BoletaBuilder } from '../src/sii'

const boleta = new BoletaBuilder()
  .afecta() // Boleta tipo 39
  .setFolio(98765)
  .setFechaEmision('2024-11-08')
  .setFormaPago(1) // Contado
  .setEmisor({
    rut: '76123456-7',
    razonSocial: 'CAFETERIA EJEMPLO',
    giro: 'Restaurantes y cafés',
    acteco: [561011],
    direccion: 'Av. Providencia 789',
    comuna: 'Providencia',
  })
  .setReceptor({
    rut: '66666666-6', // Receptor anónimo
    razonSocial: 'ANONIMO',
    direccion: 'Sin dirección',
  })
  .addProducto('Café Latte', 2, 3500)
  .addProducto('Croissant', 3, 2000)
  .addServicio('Propina', 1000)
  .calcularTotales()
  .build()

console.log(JSON.stringify(boleta, null, 2))

/*
Resultado:
{
  "Encabezado": {
    "IdDoc": {
      "TipoDTE": 39,
      "Folio": 98765,
      "FchEmis": "2024-11-08",
      "FmaPago": 1
    },
    "Emisor": { ... },
    "Receptor": { ... },
    "Totales": {
      "MntNeto": 14000,
      "TasaIVA": 19,
      "IVA": 2660,
      "MntTotal": 16660
    }
  },
  "Detalle": [
    { "NroLinDet": 1, "NmbItem": "Café Latte", "MontoItem": 7000, "QtyItem": 2, "PrcItem": 3500 },
    { "NroLinDet": 2, "NmbItem": "Croissant", "MontoItem": 6000, "QtyItem": 3, "PrcItem": 2000 },
    { "NroLinDet": 3, "NmbItem": "Propina", "MontoItem": 1000, "QtyItem": 1 }
  ]
}
*/
