// DTEBuilder - Fluent API for building DTE documents

import type {
  DTEDocument,
  Encabezado,
  IdDoc,
  Emisor,
  Receptor,
  Totales,
  Detalle,
  Referencia,
  DscRcgGlobal,
} from '../types/dte'
import type { RUTType, FechaType, ActecoType } from '../types/common'
import { calculateDetalleTotals } from '../calculators/totales'

export class DTEBuilder {
  private dte: Partial<DTEDocument> = {
    Detalle: [],
  }

  private idDoc: Partial<IdDoc> & { TipoDTE?: 33 | 34 | 39 | 41 | 43 | 46 | 52 | 56 | 61 } = {}
  private emisor: Partial<Emisor> = {}
  private receptor: Partial<Receptor> = {}
  protected totales: Partial<Totales> = {}
  protected detalle: Detalle[] = []
  protected descuentosGlobales: Array<{
    tipo: 'D' | 'R'
    valor: number
    esPorcentaje: boolean
    glosa?: string
  }> = []

  // IdDoc
  setTipo(tipo: 33 | 34 | 39 | 41 | 43 | 46 | 52 | 56 | 61): this {
    this.idDoc.TipoDTE = tipo as any
    return this
  }

  setFolio(folio: number): this {
    this.idDoc.Folio = folio
    return this
  }

  setFechaEmision(fecha: FechaType): this {
    this.idDoc.FchEmis = fecha
    return this
  }

  setFormaPago(forma: 1 | 2 | 3): this {
    this.idDoc.FmaPago = forma
    return this
  }

  setFechaVencimiento(fecha: FechaType): this {
    this.idDoc.FchVenc = fecha
    return this
  }

  // Emisor
  setEmisor(data: {
    rut: RUTType
    razonSocial: string
    giro: string
    acteco: ActecoType[]
    direccion: string
    comuna: string
    ciudad?: string
    telefono?: string[]
    correo?: string
  }): this {
    this.emisor = {
      RUTEmisor: data.rut,
      RznSoc: data.razonSocial,
      GiroEmis: data.giro,
      Acteco: data.acteco,
      DirOrigen: data.direccion,
      CmnaOrigen: data.comuna,
      ...(data.ciudad && { CdadOrigen: data.ciudad }),
      ...(data.telefono && { Telefono: data.telefono }),
      ...(data.correo && { CorreoEmisor: data.correo }),
    }
    return this
  }

  // Receptor
  setReceptor(data: {
    rut: RUTType
    razonSocial: string
    giro?: string
    direccion: string
    comuna?: string
    ciudad?: string
    correo?: string
  }): this {
    this.receptor = {
      RUTRecep: data.rut,
      RznSocRecep: data.razonSocial,
      DirRecep: data.direccion,
      ...(data.giro && { GiroRecep: data.giro }),
      ...(data.comuna && { CmnaRecep: data.comuna }),
      ...(data.ciudad && { CdadRecep: data.ciudad }),
      ...(data.correo && { CorreoRecep: data.correo }),
    }
    return this
  }

  // Detalle
  addItem(item: {
    nombre: string
    cantidad?: number
    precio?: number
    monto?: number
    descripcion?: string
    unidad?: string
    exento?: boolean
  }): this {
    const nroLinea = (this.dte.Detalle?.length || 0) + 1
    const monto = item.monto ?? (item.cantidad || 1) * (item.precio || 0)

    const detalle: Detalle = {
      NroLinDet: nroLinea,
      NmbItem: item.nombre,
      MontoItem: Math.round(monto),
      ...(item.descripcion && { DscItem: item.descripcion }),
      ...(item.cantidad && { QtyItem: item.cantidad }),
      ...(item.precio && { PrcItem: item.precio }),
      ...(item.unidad && { UnmdItem: item.unidad }),
      ...(item.exento && { IndExe: 1 as const }),
    }

    this.dte.Detalle!.push(detalle)
    this.detalle.push(detalle) // Sincronizar con protected
    return this
  }

  // Descuento/Recargo Global
  addDescuentoGlobal(data: {
    tipo: 'D' | 'R'
    valor: number
    esPorcentaje: boolean
    glosa?: string
  }): this {
    if (!this.dte.DscRcgGlobal) {
      this.dte.DscRcgGlobal = []
    }

    const nroLinea = this.dte.DscRcgGlobal.length + 1

    const dscRcg: DscRcgGlobal = {
      NroLinDR: nroLinea,
      TpoMov: data.tipo,
      TpoValor: data.esPorcentaje ? '%' : '$',
      ValorDR: data.valor,
      ...(data.glosa && { GlosaDR: data.glosa }),
    }

    this.dte.DscRcgGlobal.push(dscRcg)
    this.descuentosGlobales.push(data) // Sincronizar con protected
    return this
  }

  // Referencias
  addReferencia(data: {
    tipoDoc?: string
    folio?: string
    fecha?: FechaType
    codigo?: 1 | 2 | 3
    razon?: string
  }): this {
    if (!this.dte.Referencia) {
      this.dte.Referencia = []
    }

    const nroLinea = this.dte.Referencia.length + 1

    const ref: Partial<Referencia> = {
      NroLinRef: nroLinea,
      ...(data.tipoDoc && { TpoDocRef: data.tipoDoc }),
      ...(data.folio && { FolioRef: data.folio }),
      ...(data.fecha && { FchRef: data.fecha }),
      ...(data.codigo && { CodRef: data.codigo }),
      ...(data.razon && { RazonRef: data.razon }),
    }

    this.dte.Referencia.push(ref as Referencia)
    return this
  }

  // Calcular totales automáticamente
  calcularTotales(tasaIVA: number = 19): this {
    if (!this.dte.Detalle || this.dte.Detalle.length === 0) {
      throw new Error('No hay items para calcular totales')
    }

    let calculated = calculateDetalleTotals(this.dte.Detalle)

    // Aplicar descuentos/recargos globales si existen
    if (this.descuentosGlobales.length > 0) {
      for (const desc of this.descuentosGlobales) {
        const descuentoMonto = desc.esPorcentaje
          ? Math.round((calculated.MntNeto * desc.valor) / 100)
          : desc.valor

        if (desc.tipo === 'D') {
          // Descuento: reduce el neto
          calculated.MntNeto = Math.max(0, calculated.MntNeto - descuentoMonto)
        } else {
          // Recargo: aumenta el neto
          calculated.MntNeto += descuentoMonto
        }
      }
      // Recalcular IVA y total después de aplicar descuentos
      calculated.IVA = Math.round((calculated.MntNeto * tasaIVA) / 100)
      calculated.MntTotal = calculated.MntNeto + calculated.IVA + calculated.MntExe
    }

    this.totales = {
      ...(calculated.MntNeto > 0 && { MntNeto: calculated.MntNeto }),
      ...(calculated.MntExe > 0 && { MntExe: calculated.MntExe }),
      ...(calculated.IVA > 0 && { TasaIVA: tasaIVA }),
      ...(calculated.IVA > 0 && { IVA: calculated.IVA }),
      MntTotal: calculated.MntTotal,
    }

    return this
  }

  // Totales manuales
  setTotales(totales: Partial<Totales>): this {
    this.totales = { ...this.totales, ...totales }
    return this
  }

  // Build final
  build(): DTEDocument {
    if (!this.idDoc.TipoDTE) {
      throw new Error('TipoDTE es obligatorio')
    }
    if (!this.idDoc.Folio) {
      throw new Error('Folio es obligatorio')
    }
    if (!this.idDoc.FchEmis) {
      throw new Error('FchEmis es obligatorio')
    }
    if (!this.emisor.RUTEmisor) {
      throw new Error('Emisor es obligatorio')
    }
    if (!this.receptor.RUTRecep) {
      throw new Error('Receptor es obligatorio')
    }
    if (!this.dte.Detalle || this.dte.Detalle.length === 0) {
      throw new Error('Debe haber al menos 1 item')
    }
    if (!this.totales.MntTotal) {
      throw new Error('MntTotal es obligatorio. Use calcularTotales() o setTotales()')
    }

    const encabezado: Encabezado = {
      IdDoc: this.idDoc as IdDoc,
      Emisor: this.emisor as Emisor,
      Receptor: this.receptor as Receptor,
      Totales: this.totales as Totales,
    }

    return {
      Encabezado: encabezado,
      Detalle: this.dte.Detalle,
      ...(this.dte.DscRcgGlobal && { DscRcgGlobal: this.dte.DscRcgGlobal }),
      ...(this.dte.Referencia && { Referencia: this.dte.Referencia }),
    }
  }

  // Reset builder
  reset(): this {
    this.dte = { Detalle: [] }
    this.idDoc = {}
    this.emisor = {}
    this.receptor = {}
    this.totales = {}
    return this
  }
}
