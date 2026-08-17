import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Todas as comparações de dia neste app usam uma chave "YYYY-MM-DD" simples
 * (sem hora/fuso), para casar exatamente com o `dia_cadastrado` que a API
 * espera enviar e devolve. Nunca comparamos objetos Date diretamente para
 * evitar bugs de fuso horário.
 */
export function toDateKey(date) {
  return format(date, 'yyyy-MM-dd')
}

/** Extrai a chave "YYYY-MM-DD" de um valor vindo da API (string ISO). */
export function apiDateToKey(isoValue) {
  if (!isoValue) return null
  return String(isoValue).slice(0, 10)
}

export function nextMonth(date) {
  return addMonths(date, 1)
}

export function previousMonth(date) {
  return subMonths(date, 1)
}

export function formatMonthLabel(date) {
  return format(date, "MMMM 'de' yyyy", { locale: ptBR })
}

/** Monta a grade de dias (com preenchimento das semanas anterior/posterior) para o mês do `date`. */
export function buildCalendarGrid(date) {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(monthEnd)

  const days = []
  let cursor = gridStart
  while (cursor <= gridEnd) {
    days.push({
      date: cursor,
      key: toDateKey(cursor),
      inCurrentMonth: isSameMonth(cursor, date),
      isToday: isSameDay(cursor, new Date()),
    })
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
  }
  return days
}

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]
