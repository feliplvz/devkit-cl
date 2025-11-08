// Ejemplo: Calculadora de IVA

import { calculateIVA, calculateNeto, calculateTotal } from '../src/sii'

// Calcular IVA desde neto
const neto = 1000000
const iva = calculateIVA(neto) // 190000
const total = calculateTotal(neto) // 1190000

console.log(`Neto: $${neto.toLocaleString('es-CL')}`)
console.log(`IVA (19%): $${iva.toLocaleString('es-CL')}`)
console.log(`Total: $${total.toLocaleString('es-CL')}`)

// Extraer neto desde total
const totalConIVA = 1190000
const netoCalculado = calculateNeto(totalConIVA) // 1000000

console.log(`\nDesde total: $${totalConIVA.toLocaleString('es-CL')}`)
console.log(`Neto calculado: $${netoCalculado.toLocaleString('es-CL')}`)
