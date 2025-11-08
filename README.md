# devkit-cl

TypeScript utilities for Chilean applications. RUT validation, currency formatting, and SII electronic invoicing.

## Install

```bash
npm install devkit-cl
```

## Playground

Try the interactive DTE builder:

```bash
git clone https://github.com/feliplvz/devkit-cl
cd devkit-cl
npm install
npm run playground
```

Open http://localhost:3000/playground/index.html

## Quick Start

### RUT & Formatters

```typescript
import { validateRUT, formatRUT, formatCurrency } from 'devkit-cl'

validateRUT('12.345.678-5')  // true
formatRUT('123456789')       // '12.345.678-9'
formatCurrency(1500000)      // '$1.500.000'
```

### SII Electronic Documents

```typescript
import { DTEBuilder } from 'devkit-cl/sii'

const factura = new DTEBuilder()
  .setTipo(33)
  .setFolio(12345)
  .setFechaEmision('2024-01-15')
  .setEmisor({
    rut: '76.123.456-7',
    razonSocial: 'Empresa SpA',
    giro: 'Servicios TI',
    acteco: [620200],
    direccion: 'Av. Providencia 1234',
    comuna: 'Providencia'
  })
  .setReceptor({
    rut: '12.345.678-9',
    razonSocial: 'Cliente Ltda',
    direccion: 'Los Leones 456',
    comuna: 'Santiago'
  })
  .addItem({
    nombre: 'Desarrollo Software',
    cantidad: 1,
    precio: 1000000
  })
  .calcularTotales()
  .build()

console.log(factura)
// { Encabezado: {...}, Detalle: [...], ... }
```

### Boleta Electrónica (Simplified)

```typescript
import { BoletaBuilder } from 'devkit-cl/sii'

const boleta = new BoletaBuilder()
  .afecta()  // tipo 39
  .setFolio(789)
  .setFechaEmision('2024-01-15')
  .setEmisor({ /* ... */ })
  .setReceptor({ /* ... */ })
  .addProducto('Café', 2, 2500)
  .addServicio('Delivery', 1500)
  .calcularTotales()
  .build()
```

### Validation

```typescript
import { validateDTEStructure, validateTotales } from 'devkit-cl/sii'

const dte = builder.build()

validateDTEStructure(dte)           // throws if invalid
validateTotales(dte.Encabezado.Totales)  // verifies calculations
```

### IVA Calculators

```typescript
import { calculateIVA, calculateNeto, calculateTotal } from 'devkit-cl/sii'

calculateIVA(10000)      // 1900
calculateNeto(11900)     // 10000
calculateTotal(10000)    // 11900
```

## API Reference

### Validators

```typescript
validateRUT(rut: string): boolean
validateRUTDetailed(rut: string): { valid: boolean, formatted: string, error?: string }
```

### Formatters

```typescript
formatRUT(rut: string): string
formatPhone(phone: string): string
formatCurrency(amount: number): string
parseCurrency(formatted: string): number
```

### SII Module

#### Builders

```typescript
DTEBuilder()
  .setTipo(tipo: 33|34|43|46|52|56|61)
  .setFolio(folio: number)
  .setFechaEmision(fecha: string)
  .setFormaPago(forma: 1|2|3)
  .setEmisor(data: EmisorData)
  .setReceptor(data: ReceptorData)
  .addItem(item: ItemData)
  .addDescuentoGlobal(descuento: DescuentoData)
  .addReferencia(ref: ReferenciaData)
  .calcularTotales()
  .build(): DTEDocument

BoletaBuilder() extends DTEBuilder
  .afecta()  // tipo 39
  .exenta()  // tipo 41
  .addProducto(nombre: string, cantidad: number, precio: number)
  .addServicio(descripcion: string, monto: number)
```

#### Validators

```typescript
validateDTEStructure(dte: DTEDocument): void
validateDetalle(detalle: Detalle): void
validateTotales(totales: Totales): void
validateAllDetalles(detalles: Detalle[]): void
```

#### Calculators

```typescript
calculateIVA(monto: number, tasa?: number): number
calculateNeto(total: number, tasa?: number): number
calculateTotal(neto: number, tasa?: number): number
extractIVA(total: number, tasa?: number): number
isNetoValid(neto: number, iva: number, tasa?: number): boolean
isTotalValid(neto: number, total: number, tasa?: number): boolean

calculateDetalleTotals(
  detalles: Detalle[],
  descuentosGlobales?: DscRcgGlobal[]
): Totales
```

#### Constants

```typescript
TAX_CODES           // 27 códigos de impuestos adicionales
SII_SERVERS         // URLs certificación y producción
INDICADOR_SERVICIO  // Indicadores de servicio (1-4)
INDICADOR_TRASLADO  // Indicadores de traslado (1-9)
FORMA_PAGO          // Formas de pago (1-3)
TIPO_DESPACHO       // Tipos de despacho (1-3)
```

## Document Types Supported

- **33** - Factura Electrónica
- **34** - Factura No Afecta o Exenta
- **39** - Boleta Electrónica
- **41** - Boleta Exenta
- **43** - Liquidación Factura
- **46** - Factura de Compra
- **52** - Guía de Despacho
- **56** - Nota de Débito
- **61** - Nota de Crédito
- **110** - Factura Exportación
- **111** - Nota de Débito Exportación
- **112** - Nota de Crédito Exportación

## Examples

See `/examples` for complete usage:

- `factura-electronica.ts` - Complete factura flow
- `boleta-electronica.ts` - Boleta with simplified API
- `nota-credito.ts` - Credit note with references
- `validar-dte.ts` - Validation examples
- `calculadora-iva.ts` - IVA utilities

## License

MIT - Felipe Lopez
