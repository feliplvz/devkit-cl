// DTE (Documento Tributario Electrónico) types - DTE_v10.xsd

import type {
  RUTType,
  FolioType,
  MontoType,
  Dec16_2Type,
  PctType,
  FechaType,
  FechaHoraType,
  MailType,
  FonoType,
  ComunaType,
  CiudadType,
  RznSocType,
  DireccionType,
  GiroType,
  ActecoType,
} from './common'

// IdDoc - Identificación del documento
export interface IdDoc {
  TipoDTE: 33 | 34 | 43 | 46 | 52 | 56 | 61 // Tipo documento
  Folio: FolioType // Folio del documento
  FchEmis: FechaType // Fecha emisión
  IndNoRebaja?: 1 // Indicador no rebaja (Liquidación Factura)
  TipoDespacho?: 1 | 2 | 3 // Despacho por cuenta: emisor/receptor/otro
  IndTraslado?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 // Indicador traslado
  TpoImpresion?: 'T' | 'N' // Ticket o Normal
  IndServicio?: 1 | 2 | 3 | 4 // Indicador servicio
  MntBruto?: 1 // Indicador monto bruto
  FmaPago?: 1 | 2 | 3 // Forma pago: contado/crédito/sin costo
  FmaPagExp?: string // Forma pago exportación (max 80)
  FchCancel?: FechaType // Fecha cancelación
  MntCancel?: MontoType // Monto cancelado
  SaldoInsol?: MontoType // Saldo insoluto
  PeriodoDesde?: FechaType // Periodo facturación desde
  PeriodoHasta?: FechaType // Periodo facturación hasta
  MedioPago?: string // Medio de pago (max 40)
  TpoCtaPago?: string // Tipo cuenta pago (max 40)
  NumCtaPago?: string // Número cuenta pago (max 40)
  BcoPago?: string // Banco pago (max 40)
  TermPagoCdg?: string // Código término pago (max 4)
  TermPagoGlosa?: string // Glosa término pago (max 100)
  TermPagoDias?: number // Días término pago
  FchVenc?: FechaType // Fecha vencimiento
}

// Emisor
export interface Emisor {
  RUTEmisor: RUTType
  RznSoc: RznSocType // Razón social (max 100)
  GiroEmis: GiroType // Giro (max 80)
  Telefono?: FonoType[] // Max 2
  CorreoEmisor?: MailType
  Acteco: ActecoType[] // 1-4 actividades económicas
  Sucursal?: string // Max 20
  CdgSIISucur?: number // Código SII sucursal
  DirOrigen: DireccionType
  CmnaOrigen: ComunaType
  CdadOrigen?: CiudadType
  CdgVendedor?: string // Max 60
  IdAdicEmisor?: { // Adicionales emisor
    IdDoc?: string // Max 30
    IdDoc2?: string // Max 30
    IdDoc3?: string // Max 30
    IdDoc4?: string // Max 30
  }
}

// Receptor
export interface Receptor {
  RUTRecep: RUTType
  CdgIntRecep?: string // Código interno receptor (max 80)
  RznSocRecep: RznSocType
  NumId?: string // Número identificación extranjero (max 20)
  Nacionalidad?: number // Código país (ISO 3166)
  Extranjero?: { // Datos receptor extranjero
    NumId: string // Max 20
    Nacionalidad: number // Código país
  }
  GiroRecep?: GiroType
  Contacto?: string // Max 80
  CorreoRecep?: MailType
  DirRecep: DireccionType
  CmnaRecep?: ComunaType
  CdadRecep?: CiudadType
  DirPostal?: string // Max 70
  CmnaPostal?: string // Max 20
  CdadPostal?: string // Max 20
}

// Totales
export interface Totales {
  MntNeto?: MontoType // Monto neto
  MntExe?: MontoType // Monto exento
  MntBase?: MontoType // Monto base (margen comercialización)
  MntMargenCom?: MontoType // Monto margen comercialización
  TasaIVA?: PctType // Tasa IVA (default 19)
  IVA?: MontoType // Monto IVA
  IVAProp?: MontoType // IVA propio
  IVATerc?: MontoType // IVA terceros
  ImptoReten?: ImptoReten[] // Impuestos retenidos (max 20)
  IVANoRet?: MontoType // IVA no retenido
  CredEC?: MontoType // Crédito empresas constructoras
  GrntDep?: MontoType // Garantía depósito envases
  Comisiones?: MontoType // Comisiones
  MntTotal: MontoType // MONTO TOTAL
  MontoNF?: MontoType // Monto no facturable
  MontoPeriodo?: MontoType // Monto periodo
  SaldoAnterior?: MontoType // Saldo anterior
  VlrPagar?: MontoType // Valor a pagar
}

// Impuestos Retenidos
export interface ImptoReten {
  TipoImp: 1 | 2 | 3 | 4 | 9 | 15 | 17 | 18 | 19 | 23 | 24 | 25 | 26 | 27 | 28 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 44 | 45 | 271 // Código impuesto
  TasaImp: PctType // Tasa impuesto
  MontoImp: MontoType // Monto impuesto
}

// Detalle (Item)
export interface Detalle {
  NroLinDet: number // Número línea (1-60)
  CdgItem?: CdgItem[] // Códigos item (max 5)
  IndExe?: 1 | 2 | 3 | 4 | 5 | 6 // Indicador exención
  Retenedor?: { // Info retenedor (constructoras)
    IndRetenedor: string // Max 10
    MntRetencion: MontoType
  }
  NmbItem: string // Nombre item (max 80)
  DscItem?: string // Descripción (max 1000)
  QtyRef?: number // Cantidad referencia
  UnmdRef?: string // Unidad medida referencia (max 4)
  PrcRef?: Dec16_2Type // Precio referencia
  QtyItem?: number // Cantidad
  Subcantidad?: Subcantidad[] // Subcantidades (max 20)
  FchElabor?: FechaType // Fecha elaboración
  FchVencim?: FechaType // Fecha vencimiento
  UnmdItem?: string // Unidad medida (max 4)
  PrcItem?: Dec16_2Type // Precio unitario
  OtrMnda?: { // Otro moneda
    PrcOtrMon?: Dec16_2Type
    Moneda?: string // Max 3
    FctConv?: number // Factor conversión
  }
  DescuentoPct?: PctType // % descuento
  DescuentoMonto?: MontoType // Monto descuento
  SubDscto?: SubDscto[] // Sub-descuentos (max 20)
  RecargoPct?: PctType // % recargo
  RecargoMonto?: MontoType // Monto recargo
  SubRecargo?: SubRecargo[] // Sub-recargos (max 20)
  CodImpAdic?: 14 | 15 | 17 | 18 | 19 | 23 | 24 | 25 | 26 | 27 | 28 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 44 | 45 | 271 // Código impuesto adicional
  MontoItem: MontoType // MONTO TOTAL ITEM
}

// Código Item
export interface CdgItem {
  TpoCodigo: 'INT1' | 'INT2' | 'EAN13' | 'EAN128' | 'DUN14' | 'DUN128' | 'PLU' | string // Max 10
  VlrCodigo: string // Max 35
}

// Subcantidad
export interface Subcantidad {
  TipoCantidad: string // Max 80
  Cantidad: number
}

// Sub-Descuento
export interface SubDscto {
  TipoDscto: string // Max 10
  ValorDscto: PctType | MontoType
}

// Sub-Recargo
export interface SubRecargo {
  TipoRecargo: string // Max 10
  ValorRecargo: PctType | MontoType
}

// Descuentos/Recargos Globales
export interface DscRcgGlobal {
  NroLinDR: number // Número línea (1-20)
  TpoMov: 'D' | 'R' // Descuento o Recargo
  GlosaDR?: string // Glosa (max 45)
  TpoValor: '%' | '$' // Porcentaje o Monto
  ValorDR: PctType | MontoType
  IndExeDR?: 1 | 2 // Indicador exención
}

// Referencias a otros documentos
export interface Referencia {
  NroLinRef: number // Número línea (1-40)
  TpoDocRef?: string // Tipo documento referenciado (max 3)
  IndGlobal?: 1 // Indicador referencia global
  FolioRef?: string // Folio referencia (max 18)
  RUTOtr?: RUTType // RUT otro (factura compra)
  FchRef?: FechaType // Fecha referencia
  CodRef?: 1 | 2 | 3 // Código referencia (NC/ND)
  RazonRef?: string // Razón referencia (max 90)
}

// Comisiones y otros cargos
export interface Comisiones {
  NroLinCom: number // Número línea (1-20)
  TipoMovim: 'D' | 'R' // Descuento o Recargo
  Glosa?: string // Max 60
  ValComNeto?: MontoType // Monto neto
  ValComExe?: MontoType // Monto exento
  ValComIVA?: MontoType // Monto IVA
}

// Encabezado del DTE
export interface Encabezado {
  IdDoc: IdDoc
  Emisor: Emisor
  Receptor: Receptor
  RUTSolicita?: RUTType // RUT solicita (factoring)
  Transporte?: Transporte // Info transporte (Guías)
  Totales: Totales
  OtraMoneda?: OtraMoneda // Otra moneda
}

// Transporte (para Guías de Despacho)
export interface Transporte {
  Patente?: string // Max 8
  RUTTrans?: RUTType // RUT transportista
  Chofer?: Chofer
  DirDest?: string // Max 70
  CmnaDest?: string // Max 20
  CdadDest?: string // Max 20
  Aduana?: Aduana
}

// Chofer
export interface Chofer {
  RUTChofer?: RUTType
  NombreChofer?: string // Max 30
}

// Aduana
export interface Aduana {
  CodModVenta: 1 | 2 | 3 | 4 | 9 // Modalidad venta
  CodClauVenta: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 // Cláusula venta
  TotClauVenta?: Dec16_2Type // Total cláusula venta
  CodViaTransp: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 // Vía transporte
  NombreTransp?: string // Max 40
  RUTCiaTransp?: RUTType
  NomCiaTransp?: string // Max 40
  IdAdicTransp?: string // Max 20
  Booking?: string // Max 20
  Operador?: string // Max 20
  CodPtoEmbarque?: number // Código puerto embarque
  IdAdicPtoEmb?: string // Max 20
  CodPtoDesemb?: number // Código puerto desembarque
  IdAdicPtoDesemb?: string // Max 20
  Tara?: number // Tara
  CodUnidMedTara?: number // Código unidad medida tara
  PesoBruto?: number // Peso bruto
  CodUnidPesoBruto?: number // Código unidad peso bruto
  PesoNeto?: number // Peso neto
  CodUnidPesoNeto?: number // Código unidad peso neto
  TotItems?: number // Total items
  TotBultos?: number // Total bultos
  TipoBultos?: TipoBulto[] // Tipos bultos (max 30)
  MntFlete?: Dec16_2Type // Monto flete
  MntSeguro?: Dec16_2Type // Monto seguro
  CodPaisRecep?: number // Código país receptor
  CodPaisDestin?: number // Código país destino
}

// Tipo Bulto
export interface TipoBulto {
  CodTpoBultos?: number // Código tipo bulto
  CantBultos?: number // Cantidad bultos
  Marcas?: string // Max 255
  IdContainer?: string // Max 20
  Sello?: string // Max 20
  EmisorSello?: string // Max 70
}

// Otra Moneda
export interface OtraMoneda {
  TpoMoneda?: string // Código moneda (max 15)
  TpoCambio?: number // Tipo cambio
  MntNetoOtrMnda?: Dec16_2Type // Monto neto otra moneda
  MntExeOtrMnda?: Dec16_2Type // Monto exento otra moneda
  MntFaeCarneOtrMnda?: Dec16_2Type
  MntMargComOtrMnda?: Dec16_2Type
  IVAOtrMnda?: Dec16_2Type // IVA otra moneda
  ImpRetOtrMnda?: ImpRetOtrMnda[] // Impuestos retenidos (max 20)
  IVANoRetOtrMnda?: Dec16_2Type
  CredECOtrMnda?: Dec16_2Type
  MntTotOtrMnda?: Dec16_2Type // TOTAL otra moneda
}

// Impuesto Retenido Otra Moneda
export interface ImpRetOtrMnda {
  TipoImpOtrMnda: number
  TasaImpOtrMnda: PctType
  VlrImpOtrMnda: Dec16_2Type
}

// Documento completo
export interface DTEDocument {
  Encabezado: Encabezado
  Detalle: Detalle[] // 1-60 items
  SubTotInfo?: SubTotInfo[] // Subtotales informativos (max 20)
  DscRcgGlobal?: DscRcgGlobal[] // Descuentos/Recargos globales (max 20)
  Referencia?: Referencia[] // Referencias (max 40)
  Comisiones?: Comisiones[] // Comisiones (max 20)
  TmstFirma?: FechaHoraType // Timestamp firma
}

// Subtotal Informativo
export interface SubTotInfo {
  NroSTI: number // Número subtotal (1-20)
  GlosaSTI: string // Glosa (max 40)
  OrdenSTI: number // Orden subtotal
  SubTotNetoSTI?: MontoType // Subtotal neto
  SubTotIVASTI?: MontoType // Subtotal IVA
  SubTotExeSTI?: MontoType // Subtotal exento
  ValSubtotSTI?: MontoType // Valor subtotal
  LineasDeta?: number[] // Líneas detalle asociadas (max 60)
}
