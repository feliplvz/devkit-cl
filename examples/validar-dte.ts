// Ejemplo: Validar DTE

import { DTEBuilder, validateDTEStructure, validateTotales } from '../src/sii'

const factura = new DTEBuilder()
  .setTipo(33)
  .setFolio(12345)
  .setFechaEmision('2024-11-08')
  .setEmisor({
    rut: '76123456-7',
    razonSocial: 'MI EMPRESA',
    giro: 'Servicios',
    acteco: [620200],
    direccion: 'Av. Principal 123',
    comuna: 'Santiago',
  })
  .setReceptor({
    rut: '77654321-8',
    razonSocial: 'CLIENTE',
    direccion: 'Calle 456',
  })
  .addItem({ nombre: 'Producto 1', monto: 10000 })
  .calcularTotales()
  .build()

// Validar estructura
const structureValidation = validateDTEStructure(factura)
if (!structureValidation.valid) {
  console.error('❌ Errores de estructura:', structureValidation.errors)
} else {
  console.log('✅ Estructura válida')
}

// Validar totales
const totalesValidation = validateTotales(factura.Encabezado.Totales)
if (!totalesValidation.valid) {
  console.error('❌ Errores en totales:', totalesValidation.errors)
} else {
  console.log('✅ Totales válidos')
}

console.log(factura)
