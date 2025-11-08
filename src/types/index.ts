export type RutString = string

export interface RutValidationResult {
  valid: boolean
  formatted?: string
  error?: string
}

export interface PhoneFormatOptions {
  includeCountryCode?: boolean
  useSpaces?: boolean
}

export interface CurrencyFormatOptions {
  symbol?: string
  decimals?: number
  prefix?: boolean
}
