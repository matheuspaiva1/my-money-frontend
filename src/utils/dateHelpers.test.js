import { describe, expect, it } from 'vitest'
import { apiDateToKey, buildCalendarGrid, toDateKey } from './dateHelpers'

describe('toDateKey', () => {
  it('formata uma data local como yyyy-MM-dd', () => {
    expect(toDateKey(new Date(2026, 7, 11))).toBe('2026-08-11')
  })
})

describe('apiDateToKey', () => {
  it('extrai a chave yyyy-MM-dd de uma string ISO da API', () => {
    expect(apiDateToKey('2026-08-11T00:00:00.000Z')).toBe('2026-08-11')
  })

  it('retorna null para valores vazios', () => {
    expect(apiDateToKey(null)).toBeNull()
  })
})

describe('buildCalendarGrid', () => {
  it('gera semanas completas cobrindo o mês inteiro', () => {
    const days = buildCalendarGrid(new Date(2026, 7, 1))
    expect(days.length % 7).toBe(0)
    expect(days.some((day) => day.key === '2026-08-01')).toBe(true)
    expect(days.some((day) => day.key === '2026-08-31')).toBe(true)
  })
})
