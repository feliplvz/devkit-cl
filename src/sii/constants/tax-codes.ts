// Códigos de Impuestos Adicionales y Retenciones - SII

export interface TaxCode {
  code: number
  name: string
  article?: string
  category: 'iva-retenido' | 'iva-anticipado' | 'impuesto-especifico' | 'impuesto-adicional'
}

export const TAX_CODES: Record<number, TaxCode> = {
  14: {
    code: 14,
    name: 'IVA Margen Comercialización',
    category: 'iva-retenido',
  },
  15: {
    code: 15,
    name: 'IVA Retenido Total',
    category: 'iva-retenido',
  },
  16: {
    code: 16,
    name: 'IVA Retenido Parcial',
    category: 'iva-retenido',
  },
  17: {
    code: 17,
    name: 'IVA Anticipado Faenamiento Carne',
    category: 'iva-anticipado',
  },
  18: {
    code: 18,
    name: 'IVA Anticipado Carne',
    category: 'iva-anticipado',
  },
  19: {
    code: 19,
    name: 'IVA Anticipado Harina',
    category: 'iva-anticipado',
  },
  23: {
    code: 23,
    name: 'Impuesto Adicional Art. 37 (Oro, Joyas, Pieles)',
    article: 'Art. 37 Ley Renta',
    category: 'impuesto-adicional',
  },
  24: {
    code: 24,
    name: 'Impuesto Art. 42 a) Licores, Pisco, Destilados',
    article: 'Art. 42 letra a)',
    category: 'impuesto-especifico',
  },
  25: {
    code: 25,
    name: 'Impuesto Art. 42 c) Vinos',
    article: 'Art. 42 letra c)',
    category: 'impuesto-especifico',
  },
  26: {
    code: 26,
    name: 'Impuesto Art. 42 c) Cervezas y Bebidas Alcohólicas',
    article: 'Art. 42 letra c)',
    category: 'impuesto-especifico',
  },
  27: {
    code: 27,
    name: 'Impuesto Art. 42 d) e) Bebidas Analcohólicas y Minerales',
    article: 'Art. 42 letras d) y e)',
    category: 'impuesto-especifico',
  },
  28: {
    code: 28,
    name: 'Impuesto Específico Diesel',
    category: 'impuesto-especifico',
  },
  30: {
    code: 30,
    name: 'IVA Retenido Legumbres',
    category: 'iva-retenido',
  },
  31: {
    code: 31,
    name: 'IVA Retenido Silvestres',
    category: 'iva-retenido',
  },
  32: {
    code: 32,
    name: 'IVA Retenido Ganado',
    category: 'iva-retenido',
  },
  33: {
    code: 33,
    name: 'IVA Retenido Madera',
    category: 'iva-retenido',
  },
  34: {
    code: 34,
    name: 'IVA Retenido Trigo',
    category: 'iva-retenido',
  },
  35: {
    code: 35,
    name: 'Impuesto Específico Gasolina',
    category: 'impuesto-especifico',
  },
  36: {
    code: 36,
    name: 'IVA Retenido Arroz',
    category: 'iva-retenido',
  },
  37: {
    code: 37,
    name: 'IVA Retenido Hidrobiológicas',
    category: 'iva-retenido',
  },
  38: {
    code: 38,
    name: 'IVA Retenido Chatarra',
    category: 'iva-retenido',
  },
  39: {
    code: 39,
    name: 'IVA Retenido PPA (Productos del Agro)',
    category: 'iva-retenido',
  },
  40: {
    code: 40,
    name: 'IVA Retenido Opcional',
    category: 'iva-retenido',
  },
  41: {
    code: 41,
    name: 'IVA Retenido Construcción',
    category: 'iva-retenido',
  },
  44: {
    code: 44,
    name: 'Impuesto Adicional Art. 37 (Alfombras)',
    article: 'Art. 37 Ley Renta',
    category: 'impuesto-adicional',
  },
  45: {
    code: 45,
    name: 'Impuesto Adicional Art. 37 (Caviar, Pirotecnia)',
    article: 'Art. 37 Ley Renta',
    category: 'impuesto-adicional',
  },
  271: {
    code: 271,
    name: 'Bebidas Analcohólicas con Alto Contenido de Azúcar',
    article: 'Ley 20.780',
    category: 'impuesto-especifico',
  },
}

export function getTaxCode(code: number): TaxCode | undefined {
  return TAX_CODES[code]
}

export function isValidTaxCode(code: number): boolean {
  return code in TAX_CODES
}

export function getTaxCodesByCategory(
  category: TaxCode['category']
): TaxCode[] {
  return Object.values(TAX_CODES).filter((tax) => tax.category === category)
}
