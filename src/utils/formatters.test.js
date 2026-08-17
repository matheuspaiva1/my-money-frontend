import { describe, expect, it } from 'vitest'
import { formatCurrency } from './formatters'

describe('formatCurrency', () => {
  it('formata valores em Real', () => {
    expect(formatCurrency(650.09)).toBe('R$ 650,09')
  })

  it('trata valores ausentes/ inválidos como zero', () => {
    expect(formatCurrency(undefined)).toBe('R$ 0,00')
    expect(formatCurrency(null)).toBe('R$ 0,00')
  })
})
