/**
 * Converte a data vinda do backend em Date local, evitando o shift de fuso
 * horário de `new Date("YYYY-MM-DD")` (que é interpretado como UTC).
 * Aceita tanto "YYYY-MM-DD" quanto um ISO completo (ex.: Mongo costuma
 * serializar `dia_cadastrado` como "YYYY-MM-DDT00:00:00.000Z") — em ambos
 * os casos, o dia considerado é sempre o da própria string, não o do
 * fuso local após a conversão.
 */
export function parseApiDate(dateString) {
  const [datePart] = dateString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formata uma Date local para "YYYY-MM-DD", o formato esperado por
 * `dia_cadastrado` no POST /schedule.
 */
export function toApiDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
