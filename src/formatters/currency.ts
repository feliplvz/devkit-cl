import type { CurrencyFormatOptions } from '../types'

const DEFAULT_OPTIONS: CurrencyFormatOptions = {
  symbol: '$',
  decimals: 0,
  prefix: true,
}

export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {}
): string {
  if (typeof amount !== 'number' || !isFinite(amount)) return ''

  const opts = { ...DEFAULT_OPTIONS, ...options }
  const decimals = opts.decimals ?? 0

  const rounded = Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals)

  const [integerPart, decimalPart] = rounded.toFixed(decimals).split('.')

  const formattedInteger = integerPart!.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  let formatted = formattedInteger

  if (decimals > 0 && decimalPart) {
    formatted += `,${decimalPart}`
  }

  if (opts.prefix) {
    return `${opts.symbol}${formatted}`
  } else {
    return `${formatted} ${opts.symbol}`
  }
}

export function parseCurrency(value: string): number {
  if (!value || typeof value !== 'string') return 0

  let cleaned = value.replace(/[^\d,.-]/g, '')

  cleaned = cleaned.replace(/\./g, '')

  cleaned = cleaned.replace(/,/g, '.')

  const parsed = parseFloat(cleaned)

  return isNaN(parsed) ? 0 : parsed
}
