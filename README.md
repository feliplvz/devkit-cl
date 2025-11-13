# devkit-cl

TypeScript utilities for Chilean applications. RUT validation, currency formatting, and SII electronic document (DTE) construction.

## Status

**In Progress** - This library provides complete TypeScript types, builders, validators, and calculators for Chilean SII electronic documents. Digital signature and SII submission features are not included.

## Installation

```bash
npm install devkit-cl
```

## Features

- Complete TypeScript types for SII DTE specifications (DTE_v10.xsd)
- Fluent API builders for factura and boleta construction
- Automatic IVA calculation with Chilean tax rules
- Comprehensive validation (structure, totals, items)
- RUT validation and formatting utilities
- Currency and phone number formatters
- 104 test cases with 85% coverage

## Quick Start

### RUT Validation & Formatting

```typescript
import { validateRUT, formatRUT, formatCurrency } from 'devkit-cl'

validateRUT('12.345.678-5')  // true
formatRUT('123456789')       // '12.345.678-9'
formatCurrency(1500000)      // '$1.500.000'
```

## SII Module

### Factura Electrónica (Tipo 33)

```typescript
import { DTEBuilder } from 'devkit-cl/sii'

const factura = new DTEBuilder()
  .setTipo(33)
  .setFolio(12345)
  .setFechaEmision('2024-01-15')
  .setEmisor({
    rut: '76123456-7',
    razonSocial: 'TechCorp SpA',
    giro: 'Desarrollo Software',
    acteco: [620200],
    direccion: 'Av. Providencia 1234',
    comuna: 'Providencia'
  })
  .setReceptor({
    rut: '12345678-9',
    razonSocial: 'Cliente Enterprise Ltda',
    direccion: 'Los Leones 456',
    comuna: 'Santiago'
  })
  .addItem({
    nombre: 'Desarrollo Sistema CRM',
    descripcion: 'Sistema personalizado de gestión',
    cantidad: 1,
    precio: 1000000
  })
  .addItem({
    nombre: 'Hosting Cloud 1 año',
    cantidad: 12,
    precio: 5000
  })
  .calcularTotales()
  .build()

// Result:
// {
//   Encabezado: {
//     IdDoc: { TipoDTE: 33, Folio: 12345, ... },
//     Emisor: { RUTEmisor: '76123456-7', ... },
//     Receptor: { RUTRecep: '12345678-9', ... },
//     Totales: { MntNeto: 1060000, IVA: 201400, MntTotal: 1261400 }
//   },
//   Detalle: [...]
// }
```

### Boleta Electrónica (Tipo 39/41)

The `BoletaBuilder` implements Chilean boleta specifications where **IVA is included in the price** (not added separately). Auto-calculation happens on `.build()`.

```typescript
import { BoletaBuilder } from 'devkit-cl/sii'

// Boleta Afecta (tipo 39) - Supermarket example
const boleta = new BoletaBuilder()
  .afecta()
  .setFolio(789)
  .setFechaEmision('2024-01-15')
  .setEmisor({
    rut: '76111222-3',
    razonSocial: 'Supermercado Central',
    giro: 'Retail',
    acteco: [521010],
    direccion: 'Av. Central 100',
    comuna: 'Santiago'
  })
  .setReceptor({
    rut: '66666666-6',  // Generic receptor for retail
    razonSocial: 'Cliente Final',
    direccion: 'Santiago',
    comuna: 'Santiago'
  })
  .addProducto('Leche', 2, 1500)
  .addProducto('Pan', 5, 1000)
  .addServicio('Bolsa', 200)
  .build()  // Auto-calculates totals with IVA included

// Totales: { MntTotal: 8200, IVA: 1310 (included) }
```

```typescript
// Boleta Exenta (tipo 41) - Pharmacy example
const boletaExenta = new BoletaBuilder()
  .exenta()
  .setFolio(456)
  .setFechaEmision('2024-01-15')
  .setEmisor({ /* pharmacy data */ })
  .setReceptor({ /* ... */ })
  .addProducto('Medicamento recetado', 1, 15000)
  .addProducto('Vitaminas', 2, 8000)
  .build()

// Totales: { MntExe: 31000, MntTotal: 31000 } (no IVA)
```

### Items with Exempt Status

```typescript
const factura = new DTEBuilder()
  .setTipo(33)
  // ... emisor, receptor ...
  .addItem({
    nombre: 'Software License',
    cantidad: 1,
    precio: 100000
  })
  .addItem({
    nombre: 'Libro técnico',
    cantidad: 3,
    precio: 15000,
    exento: true  // Books are VAT exempt
  })
  .calcularTotales()
  .build()

// Totales: { MntNeto: 100000, IVA: 19000, MntExe: 45000, MntTotal: 164000 }
```

### Global Discounts and Surcharges

```typescript
const factura = new DTEBuilder()
  .setTipo(33)
  // ... emisor, receptor, items ...
  .addDescuentoGlobal({
    tipo: 'D',  // D = Descuento, R = Recargo
    valor: 10,
    esPorcentaje: true,
    glosa: 'Descuento cliente frecuente'
  })
  .addDescuentoGlobal({
    tipo: 'R',
    valor: 500,
    esPorcentaje: false,
    glosa: 'Cargo por envío urgente'
  })
  .calcularTotales()
  .build()

// Discounts/surcharges are applied to MntNeto before IVA calculation
```

### Document References (Notas de Crédito)

```typescript
const notaCredito = new DTEBuilder()
  .setTipo(61)
  .setFolio(999)
  .setFechaEmision('2024-01-20')
  // ... emisor, receptor, items ...
  .addReferencia({
    tipoDoc: '33',
    folio: '12345',
    fecha: '2024-01-15',
    codigo: 1,  // 1 = Anula documento de referencia
    razon: 'Anulación por error en factura original'
  })
  .calcularTotales()
  .build()
```

### Validation

```typescript
import { 
  validateDTEStructure, 
  validateTotales,
  validateDetalle,
  validateAllDetalles 
} from 'devkit-cl/sii'

const dte = builder.build()

// Validate complete structure
try {
  validateDTEStructure(dte)
  console.log('DTE structure is valid')
} catch (error) {
  console.error('Validation failed:', error.message)
}

// Validate totals consistency
validateTotales(dte.Encabezado.Totales)  // throws if invalid

// Validate individual or all items
validateDetalle(dte.Detalle[0])
validateAllDetalles(dte.Detalle)
```

### IVA Calculators

Chilean tax calculations with 19% IVA rate.

```typescript
import { 
  calculateIVA, 
  calculateNeto, 
  calculateTotal,
  extractIVA,
  isNetoValid,
  isTotalValid
} from 'devkit-cl/sii'

// Factura calculations (IVA added to neto)
calculateIVA(10000)       // 1900
calculateTotal(10000)     // 11900
calculateNeto(11900)      // 10000

// Boleta calculations (IVA included in total)
extractIVA(11900)         // 1900 (IVA included in price)

// Validation
isNetoValid(10000, 1900)  // true
isTotalValid(10000, 11900) // true
```

## API Reference

### Core Utilities

#### RUT Validation

```typescript
validateRUT(rut: string): boolean
validateRUTDetailed(rut: string): { 
  valid: boolean
  formatted: string
  error?: string 
}
```

#### Formatters

```typescript
formatRUT(rut: string): string
formatPhone(phone: string): string
formatCurrency(amount: number): string
parseCurrency(formatted: string): number
```

### SII API Reference

#### DTEBuilder

```typescript
class DTEBuilder {
  setTipo(tipo: 33|34|43|46|52|56|61): this
  setFolio(folio: number): this
  setFechaEmision(fecha: string): this
  setFormaPago(forma: 1|2|3): this
  setEmisor(data: EmisorData): this
  setReceptor(data: ReceptorData): this
  addItem(item: ItemData): this
  addDescuentoGlobal(descuento: DescuentoData): this
  addReferencia(ref: ReferenciaData): this
  calcularTotales(): this
  build(): DTEDocument
}
```

#### BoletaBuilder

```typescript
class BoletaBuilder extends DTEBuilder {
  afecta(): this        // Set tipo to 39
  exenta(): this        // Set tipo to 41
  addProducto(nombre: string, cantidad: number, precio: number): this
  addServicio(descripcion: string, monto: number): this
  build(): DTEDocument  // Auto-calculates totals with IVA included
}
```

#### Validation Functions

```typescript
validateDTEStructure(dte: DTEDocument): void
validateDetalle(detalle: Detalle): void
validateTotales(totales: Totales): void
validateAllDetalles(detalles: Detalle[]): void
```

#### Calculator Functions

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

#### SII Constants

```typescript
TAX_CODES           // 27 additional tax codes
SII_SERVERS         // Certification and production URLs
INDICADOR_SERVICIO  // Service indicators (1-4)
INDICADOR_TRASLADO  // Transfer indicators (1-9)
FORMA_PAGO          // Payment methods (1-3)
TIPO_DESPACHO       // Dispatch types (1-3)
```

## Supported Document Types

| Code | Description |
|------|-------------|
| 33 | Factura Electrónica |
| 34 | Factura No Afecta o Exenta |
| 39 | Boleta Electrónica |
| 41 | Boleta Exenta |
| 43 | Liquidación Factura |
| 46 | Factura de Compra |
| 52 | Guía de Despacho |
| 56 | Nota de Débito |
| 61 | Nota de Crédito |
| 110 | Factura Exportación |
| 111 | Nota de Débito Exportación |
| 112 | Nota de Crédito Exportación |

## Key Concepts

### IVA Calculation: Facturas vs Boletas

This library correctly implements Chilean tax rules:

**Facturas (tipo 33):** IVA is **added** to the neto amount.

```typescript
// Input: Neto = $10,000
// Calculation: IVA = $10,000 × 0.19 = $1,900
// Result: Total = $10,000 + $1,900 = $11,900
```

**Boletas (tipo 39):** IVA is **included** in the price.

```typescript
// Input: Price with IVA = $11,900
// Calculation: IVA = $11,900 / 1.19 × 0.19 = $1,900
// Result: Neto = $10,000, Total = $11,900
```

The `BoletaBuilder` automatically handles IVA-included calculations when `.build()` is called, eliminating the need for manual calculation.

### Exempt Items

Items marked as `exento: true` are not subject to IVA. Common exempt items include books, medications, and certain educational services.

```typescript
.addItem({
  nombre: 'Libro',
  precio: 15000,
  exento: true
})
```

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Current coverage: 85% overall

- Builders: 92.17%
- Calculators: 80.53%
- Validators: 80.87%

## Development

```bash
git clone https://github.com/feliplvz/devkit-cl
cd devkit-cl
npm install
npm run dev           # Development mode
npm run build         # Build for production
npm run lint          # ESLint
```

## Limitations

- **Digital signature not included** - You must implement XML signing separately
- **SII submission not included** - API integration with SII servers must be implemented separately
- **Certificate management not included** - Handle digital certificates in your application layer

This library focuses on DTE structure, validation, and calculations according to SII specifications (DTE_v10.xsd).

## Resources

- [SII Official Documentation](https://www.sii.cl/factura_electronica/)
- [DTE Technical Schema (DTE_v10.xsd)](https://www.sii.cl/factura_electronica/formato_dte.pdf)
- [Boleta Electrónica Guide](https://www.sii.cl/servicios_online/1039-1281.html)

## Contributing

Contributions are welcome. Please ensure:

- All tests pass (`npm test`)
- Coverage remains above 80%
- Code follows existing style (ESLint)
- Add tests for new features

## License

MIT License - Felipe Lopez

## Support

For issues, questions, or contributions, please open an issue on GitHub.
