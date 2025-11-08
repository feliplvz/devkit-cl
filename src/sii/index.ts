export { 
  DOCUMENT_TYPES, 
  getDocumentType, 
  isValidDocumentType,
  isElectronicDocument,
  isTaxableDocument,
  type DocumentType 
} from './document-types'

export { 
  validateFolio, 
  formatFolio,
  type FolioValidationResult 
} from './folio'

export type * from './types/common'
export type * from './types/dte'

export {
  TAX_CODES,
  getTaxCode,
  isValidTaxCode,
  getTaxCodesByCategory,
  type TaxCode,
} from './constants/tax-codes'

export {
  INDICADOR_SERVICIO,
  INDICADOR_TRASLADO,
  FORMA_PAGO,
  TIPO_DESPACHO,
  TIPO_IMPRESION,
  TIPO_MOVIMIENTO,
  CODIGO_REFERENCIA,
  INDICADOR_EXENCION,
  type IndServicio,
  type IndTraslado,
  type FormaPago,
  type TipoDespacho,
  type TipoImpresion,
  type TipoMovimiento,
  type CodigoReferencia,
  type IndicadorExencion,
} from './constants/indicators'

export {
  SII_SERVERS,
  getServerUrl,
  type Environment,
} from './constants/servers'

export {
  calculateIVA,
  calculateNeto,
  calculateTotal,
  extractIVA,
  isNetoValid,
  isTotalValid,
  calculateDetalleTotals,
  applyGlobalDiscounts,
  validateTotales,
  type CalculatedTotals,
} from './calculators'
