import { describe, expect, it } from 'vitest'
import { horasSchema } from './validators'

describe('horasSchema', () => {
  it('aceita horas dentro do intervalo permitido pela API (0 < h <= 24)', () => {
    expect(horasSchema.safeParse({ horas: 8 }).success).toBe(true)
    expect(horasSchema.safeParse({ horas: 24 }).success).toBe(true)
  })

  it('rejeita zero, negativos e valores acima de 24', () => {
    expect(horasSchema.safeParse({ horas: 0 }).success).toBe(false)
    expect(horasSchema.safeParse({ horas: -1 }).success).toBe(false)
    expect(horasSchema.safeParse({ horas: 25 }).success).toBe(false)
  })
})
