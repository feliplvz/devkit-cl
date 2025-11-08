# devkit-cl

TypeScript utilities for Chilean applications.

## Install

```bash
npm install devkit-cl
```

## Usage

```typescript
import { validateRUT, formatPhone, formatCurrency } from 'devkit-cl'

validateRUT('12.345.678-5')
formatPhone('912345678')
formatCurrency(1500000)
```

## API

### Validators

```typescript
validateRUT('12.345.678-5')        // true
validateRUTDetailed('12.345.678-5') // { valid: true, formatted: '12.345.678-5' }
```

### Formatters

```typescript
formatRUT('123456789')             // '12.345.678-9'
formatPhone('912345678')           // '+56 9 1234 5678'
formatCurrency(1500000)            // '$1.500.000'
parseCurrency('$1.500.000')        // 1500000
```

## License

MIT
