// BoletaBuilder - Simplified builder for Boletas

import type { DTEDocument } from '../types/dte'
import { DTEBuilder } from './DTEBuilder'

export class BoletaBuilder extends DTEBuilder {
  constructor() {
    super()
  }

  // Boleta Afecta (tipo 39)
  afecta(): this {
    super.setTipo(39)
    return this
  }

  // Boleta Exenta (tipo 41)
  exenta(): this {
    super.setTipo(41)
    return this
  }

  // Simplificado: agregar producto rápido
  addProducto(nombre: string, cantidad: number, precio: number): this {
    return this.addItem({
      nombre,
      cantidad,
      precio,
      monto: cantidad * precio,
    })
  }

  // Simplificado: agregar servicio
  addServicio(descripcion: string, monto: number): this {
    return this.addItem({
      nombre: descripcion,
      cantidad: 1,
      monto,
    })
  }

  build(): DTEDocument {
    return super.build()
  }
}
