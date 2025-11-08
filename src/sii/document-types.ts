export interface DocumentType {
  code: number
  name: string
  abbreviation: string
  electronic: boolean
  taxable: boolean
}

export const DOCUMENT_TYPES: Record<number, DocumentType> = {
  33: {
    code: 33,
    name: 'Factura Electrónica',
    abbreviation: 'FE',
    electronic: true,
    taxable: true,
  },
  34: {
    code: 34,
    name: 'Factura Exenta Electrónica',
    abbreviation: 'FEE',
    electronic: true,
    taxable: false,
  },
  39: {
    code: 39,
    name: 'Boleta Electrónica',
    abbreviation: 'BE',
    electronic: true,
    taxable: true,
  },
  41: {
    code: 41,
    name: 'Boleta Exenta Electrónica',
    abbreviation: 'BEE',
    electronic: true,
    taxable: false,
  },
  43: {
    code: 43,
    name: 'Liquidación-Factura Electrónica',
    abbreviation: 'LFE',
    electronic: true,
    taxable: true,
  },
  46: {
    code: 46,
    name: 'Factura de Compra Electrónica',
    abbreviation: 'FCE',
    electronic: true,
    taxable: true,
  },
  52: {
    code: 52,
    name: 'Guía de Despacho Electrónica',
    abbreviation: 'GDE',
    electronic: true,
    taxable: false,
  },
  56: {
    code: 56,
    name: 'Nota de Débito Electrónica',
    abbreviation: 'NDE',
    electronic: true,
    taxable: true,
  },
  61: {
    code: 61,
    name: 'Nota de Crédito Electrónica',
    abbreviation: 'NCE',
    electronic: true,
    taxable: true,
  },
  110: {
    code: 110,
    name: 'Factura de Exportación Electrónica',
    abbreviation: 'FEX',
    electronic: true,
    taxable: false,
  },
  111: {
    code: 111,
    name: 'Nota de Débito de Exportación Electrónica',
    abbreviation: 'NDEX',
    electronic: true,
    taxable: false,
  },
  112: {
    code: 112,
    name: 'Nota de Crédito de Exportación Electrónica',
    abbreviation: 'NCEX',
    electronic: true,
    taxable: false,
  },
}

export function getDocumentType(code: number): DocumentType | undefined {
  return DOCUMENT_TYPES[code]
}

export function isValidDocumentType(code: number): boolean {
  return code in DOCUMENT_TYPES
}

export function isElectronicDocument(code: number): boolean {
  const doc = DOCUMENT_TYPES[code]
  return doc?.electronic ?? false
}

export function isTaxableDocument(code: number): boolean {
  const doc = DOCUMENT_TYPES[code]
  return doc?.taxable ?? false
}
