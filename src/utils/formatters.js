const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const NBSP = String.fromCharCode(160)

export function formatCurrency(value) {
  const number = Number(value) || 0
  // Intl pode devolver um espaço não separável (NBSP) entre "R$" e o valor;
  // normalizamos para um espaço comum para evitar surpresas visuais/em testes.
  return currencyFormatter.format(number).split(NBSP).join(' ')
}

export function formatHours(value) {
  const number = Number(value) || 0
  return `${number}h`
}
