import { parseApiDate } from './date';

// Mesmas constantes usadas pelo backend (GET /earnings) para o total geral.
// Não existe endpoint de ganhos por mês, então o total do mês selecionado é
// calculado no cliente a partir de GET /schedule + a flag `transporte` de GET /company.
export const HOURLY_RATE = 5.33;
export const TRANSPORT_ALLOWANCE = 10.8;

/**
 * Calcula horas, dias e valor acumulado de um mês/ano específico a partir da
 * lista completa de schedules, espelhando a fórmula do backend:
 * ganho_do_dia = horas_cadastradas_dia * HOURLY_RATE + (transporte ? TRANSPORT_ALLOWANCE : 0)
 */
export function calculateMonthSummary(schedules, { transporte, month, year }) {
  const monthSchedules = schedules.filter((schedule) => {
    const date = parseApiDate(schedule.dia_cadastrado);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const totalHoras = monthSchedules.reduce((sum, s) => sum + s.horas_cadastradas_dia, 0);
  const totalDias = monthSchedules.length;
  const totalValor = monthSchedules.reduce((sum, s) => {
    const ganhoDia = s.horas_cadastradas_dia * HOURLY_RATE + (transporte ? TRANSPORT_ALLOWANCE : 0);
    return sum + ganhoDia;
  }, 0);

  return {
    totalHoras: Math.round(totalHoras * 100) / 100,
    totalDias,
    totalValor: Math.round(totalValor * 100) / 100,
  };
}
