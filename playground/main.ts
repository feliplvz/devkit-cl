import { DTEBuilder, BoletaBuilder } from '../src/sii'
import { validateDTEStructure, validateTotales } from '../src/sii'
import type { DTEDocument } from '../src/sii'

let currentBuilder: DTEBuilder | BoletaBuilder = new DTEBuilder()
let currentDocType: 33 | 39 | 41 | 61 = 33
let itemCount = 0

// DOM Elements
const dteForm = document.getElementById('dteForm') as HTMLFormElement
const jsonOutput = document.getElementById('jsonOutput') as HTMLElement
const validationOutput = document.getElementById('validationOutput') as HTMLElement
const itemsList = document.getElementById('itemsList') as HTMLElement
const addItemBtn = document.getElementById('addItem') as HTMLButtonElement
const resetBtn = document.getElementById('resetForm') as HTMLButtonElement
const copyBtn = document.getElementById('copyJson') as HTMLButtonElement
const docTypeBtns = document.querySelectorAll('.doc-btn')
const tabs = document.querySelectorAll('.tab')

// Initialize
setTodayDate()
addFirstItem()

// Doc type selection
docTypeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    docTypeBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    
    const type = parseInt(btn.getAttribute('data-type')!) as 33 | 39 | 41 | 61
    currentDocType = type
    
    if (type === 39 || type === 41) {
      currentBuilder = new BoletaBuilder()
    } else {
      currentBuilder = new DTEBuilder()
    }
  })
})

// Add item
addItemBtn.addEventListener('click', () => {
  addItemToForm()
})

// Form submit
dteForm.addEventListener('submit', (e) => {
  e.preventDefault()
  generateDTE()
})

// Reset
resetBtn.addEventListener('click', () => {
  dteForm.reset()
  itemsList.innerHTML = ''
  itemCount = 0
  setTodayDate()
  addFirstItem()
  jsonOutput.textContent = '// El DTE generado aparecerá aquí'
  validationOutput.innerHTML = '<p class="placeholder">Genera un DTE para ver validaciones</p>'
})

// Copy JSON
copyBtn.addEventListener('click', async () => {
  const json = jsonOutput.textContent
  if (json && json !== '// El DTE generado aparecerá aquí') {
    await navigator.clipboard.writeText(json)
    copyBtn.textContent = '✅'
    setTimeout(() => copyBtn.textContent = '📋', 1000)
  }
})

// Tabs
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab')!
    
    tabs.forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active')
    })
    
    if (tabName === 'json') {
      document.getElementById('jsonTab')!.classList.add('active')
    } else {
      document.getElementById('validationTab')!.classList.add('active')
    }
  })
})

function setTodayDate() {
  const fechaInput = document.getElementById('fechaEmision') as HTMLInputElement
  fechaInput.value = new Date().toISOString().split('T')[0]
}

function addFirstItem() {
  addItemToForm()
}

function addItemToForm() {
  itemCount++
  
  const itemCard = document.createElement('div')
  itemCard.className = 'item-card'
  itemCard.innerHTML = `
    <div class="item-header">
      <span class="item-number">Item #${itemCount}</span>
      <button type="button" class="btn-remove" onclick="this.closest('.item-card').remove()">×</button>
    </div>
    <div class="form-grid">
      <div class="form-field">
        <label>Nombre</label>
        <input type="text" name="itemNombre" placeholder="Producto o servicio" required>
      </div>
      <div class="form-field">
        <label>Cantidad</label>
        <input type="number" name="itemCantidad" placeholder="1" min="0.001" step="0.001" required>
      </div>
      <div class="form-field">
        <label>Precio Unitario</label>
        <input type="number" name="itemPrecio" placeholder="10000" min="0" required>
      </div>
      <div class="form-field">
        <label>Descuento %</label>
        <input type="number" name="itemDescuento" placeholder="0" min="0" max="100" value="0">
      </div>
    </div>
  `
  
  itemsList.appendChild(itemCard)
}

function generateDTE() {
  try {
    // Reset builder
    if (currentDocType === 39 || currentDocType === 41) {
      currentBuilder = new BoletaBuilder()
    } else {
      currentBuilder = new DTEBuilder()
    }
    
    // Get form data
    const formData = new FormData(dteForm)
    
    // Set tipo and basic data
    currentBuilder
      .setTipo(currentDocType as any)
      .setFolio(parseInt((document.getElementById('folio') as HTMLInputElement).value))
      .setFechaEmision((document.getElementById('fechaEmision') as HTMLInputElement).value)
      .setFormaPago(parseInt((document.getElementById('formaPago') as HTMLSelectElement).value) as 1 | 2 | 3)
    
    // Set emisor
    const giroEmisor = (document.getElementById('emisorGiro') as HTMLInputElement).value
    const dirEmisor = (document.getElementById('emisorDireccion') as HTMLInputElement).value
    const comunaEmisor = (document.getElementById('emisorComuna') as HTMLInputElement).value
    
    currentBuilder.setEmisor({
      rut: (document.getElementById('emisorRut') as HTMLInputElement).value,
      razonSocial: (document.getElementById('emisorRazon') as HTMLInputElement).value,
      giro: giroEmisor,
      acteco: [1],
      direccion: dirEmisor,
      comuna: comunaEmisor,
    })
    
    // Set receptor
    const giroReceptor = (document.getElementById('receptorGiro') as HTMLInputElement).value
    const dirReceptor = (document.getElementById('receptorDireccion') as HTMLInputElement).value
    const comunaReceptor = (document.getElementById('receptorComuna') as HTMLInputElement).value
    
    currentBuilder.setReceptor({
      rut: (document.getElementById('receptorRut') as HTMLInputElement).value,
      razonSocial: (document.getElementById('receptorRazon') as HTMLInputElement).value,
      ...(giroReceptor && { giro: giroReceptor }),
      direccion: dirReceptor,
      ...(comunaReceptor && { comuna: comunaReceptor }),
    })
    
    // Add items
    const itemCards = document.querySelectorAll('.item-card')
    itemCards.forEach((card) => {
      const nombre = (card.querySelector('[name="itemNombre"]') as HTMLInputElement).value
      const cantidad = parseFloat((card.querySelector('[name="itemCantidad"]') as HTMLInputElement).value)
      const precio = parseInt((card.querySelector('[name="itemPrecio"]') as HTMLInputElement).value)
      const descuento = parseFloat((card.querySelector('[name="itemDescuento"]') as HTMLInputElement).value)
      
      currentBuilder.addItem({
        nombre,
        cantidad,
        precio,
        ...(descuento > 0 && { descuentoPct: descuento }),
      })
    })
    
    // Calculate totals and build
    currentBuilder.calcularTotales()
    const dte = currentBuilder.build()
    
    // Display JSON
    jsonOutput.textContent = JSON.stringify(dte, null, 2)
    
    // Run validations
    runValidations(dte)
    
  } catch (error) {
    jsonOutput.textContent = `// Error: ${(error as Error).message}`
    validationOutput.innerHTML = `
      <div class="validation-error">
        <strong>❌ Error al generar DTE:</strong><br>
        ${(error as Error).message}
      </div>
    `
  }
}

function runValidations(dte: DTEDocument) {
  const validations: Array<{ type: 'success' | 'error' | 'warning', message: string }> = []
  
  // Structure validation
  try {
    validateDTEStructure(dte)
    validations.push({
      type: 'success',
      message: '✅ Estructura del DTE válida'
    })
  } catch (error) {
    validations.push({
      type: 'error',
      message: `❌ Error de estructura: ${(error as Error).message}`
    })
  }
  
  // Totals validation
  try {
    validateTotales(dte.Encabezado.Totales)
    validations.push({
      type: 'success',
      message: '✅ Totales calculados correctamente'
    })
  } catch (error) {
    validations.push({
      type: 'error',
      message: `❌ Error en totales: ${(error as Error).message}`
    })
  }
  
  // Additional checks
  if (dte.Detalle.length > 60) {
    validations.push({
      type: 'warning',
      message: '⚠️ El DTE tiene más de 60 items'
    })
  }
  
  const total = dte.Encabezado.Totales.MntTotal
  if (total > 100000000) {
    validations.push({
      type: 'warning',
      message: '⚠️ Total muy alto, verificar'
    })
  }
  
  // Render validations
  validationOutput.innerHTML = validations.map(v => `
    <div class="validation-item validation-${v.type}">
      ${v.message}
    </div>
  `).join('')
}
