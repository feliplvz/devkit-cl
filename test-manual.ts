import { 
  validateRUT, 
  validateRUTDetailed,
  formatRUT,
  formatPhone,
  formatCurrency,
  parseCurrency
} from './src/index'

console.log('🧪 Probando devkit-cl\n')

console.log('📋 Validadores RUT:')
console.log('validateRUT("12.345.678-5"):', validateRUT('12.345.678-5'))
console.log('validateRUT("11.111.111-1"):', validateRUT('11.111.111-1'))
console.log('validateRUT("12345678-9"):', validateRUT('12345678-9'))
console.log()

console.log('validateRUTDetailed("12.345.678-5"):')
console.log(validateRUTDetailed('12.345.678-5'))
console.log()

console.log('validateRUTDetailed("12345678-9") [inválido]:')
console.log(validateRUTDetailed('12345678-9'))
console.log()

console.log('✨ Formatters RUT:')
console.log('formatRUT("123456789"):', formatRUT('123456789'))
console.log('formatRUT("12345678-9"):', formatRUT('12345678-9'))
console.log()

console.log('📱 Formatters Phone:')
console.log('formatPhone("912345678"):', formatPhone('912345678'))
console.log('formatPhone("912345678", { includeCountryCode: false }):', 
  formatPhone('912345678', { includeCountryCode: false }))
console.log('formatPhone("912345678", { useSpaces: false }):', 
  formatPhone('912345678', { useSpaces: false }))
console.log()

console.log('💰 Formatters Currency:')
console.log('formatCurrency(1500000):', formatCurrency(1500000))
console.log('formatCurrency(1500000.50, { decimals: 2 }):', 
  formatCurrency(1500000.50, { decimals: 2 }))
console.log('formatCurrency(1500000, { symbol: "CLP", prefix: false }):', 
  formatCurrency(1500000, { symbol: 'CLP', prefix: false }))
console.log()

console.log('parseCurrency("$1.500.000"):', parseCurrency('$1.500.000'))
console.log('parseCurrency("$1.500.000,50"):', parseCurrency('$1.500.000,50'))
console.log()

console.log('✅ Todas las funciones probadas!')
