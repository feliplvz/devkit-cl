// Indicadores SII

export const INDICADOR_SERVICIO = {
  1: 'Factura de Servicios Periódicos',
  2: 'Factura de Servicios Periódicos Domiciliarios',
  3: 'Factura de Boleta',
  4: 'Factura de Servicios de Hotelería',
} as const

export const INDICADOR_TRASLADO = {
  1: 'Operación constituye venta',
  2: 'Ventas por efectuar',
  3: 'Consignaciones',
  4: 'Entrega gratuita',
  5: 'Traslados internos',
  6: 'Otros traslados no venta',
  7: 'Guía de devolución',
  8: 'Traslado para exportación (no venta)',
  9: 'Venta para exportación',
} as const

export const FORMA_PAGO = {
  1: 'Contado',
  2: 'Crédito',
  3: 'Sin Costo',
} as const

export const TIPO_DESPACHO = {
  1: 'Despacho por cuenta del emisor',
  2: 'Despacho por cuenta del receptor',
  3: 'Despacho por cuenta de terceros',
} as const

export const TIPO_IMPRESION = {
  T: 'Ticket',
  N: 'Normal',
} as const

export const TIPO_MOVIMIENTO = {
  D: 'Descuento',
  R: 'Recargo',
} as const

export const CODIGO_REFERENCIA = {
  1: 'Anula Documento de Referencia',
  2: 'Corrige Texto Documento Referencia',
  3: 'Corrige Montos',
} as const

export const INDICADOR_EXENCION = {
  1: 'No afecto o exento de IVA (Art. 12 letra E)',
  2: 'Producto o servicio no es facturable',
  3: 'Garantía de depósito por envases',
  4: 'Ítem no venta',
  5: 'Ítem a rebajar',
  6: 'Producto o servicio no facturable negativo',
} as const

export type IndServicio = keyof typeof INDICADOR_SERVICIO
export type IndTraslado = keyof typeof INDICADOR_TRASLADO
export type FormaPago = keyof typeof FORMA_PAGO
export type TipoDespacho = keyof typeof TIPO_DESPACHO
export type TipoImpresion = keyof typeof TIPO_IMPRESION
export type TipoMovimiento = keyof typeof TIPO_MOVIMIENTO
export type CodigoReferencia = keyof typeof CODIGO_REFERENCIA
export type IndicadorExencion = keyof typeof INDICADOR_EXENCION
