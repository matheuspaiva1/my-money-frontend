import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseApiDate, toApiDateString } from '../../utils/date';

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function buildCalendarCells(year, month) {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), muted: false });
  }
  // Completa a última semana com os dias iniciais do próximo mês (esmaecidos).
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= trailing; day += 1) {
    cells.push({ date: new Date(year, month + 1, day), muted: true });
  }

  return cells;
}

// Calendário mensal navegável. Marca (e desabilita) os dias que já têm
// lançamento em GET /schedule, evitando que o aluno tente cadastrar horas
// duas vezes no mesmo dia (a API responderia 409).
export default function Calendar({ month, year, schedules, onMonthChange, onSelectDay }) {
  // Normaliza `dia_cadastrado` para "YYYY-MM-DD" antes de comparar: o backend
  // pode serializar a data como ISO completo (ex.: "...T00:00:00.000Z"), e a
  // comparação por string crua nunca bateria com a chave gerada pro calendário.
  const registeredDays = new Set(
    schedules.map((schedule) => toApiDateString(parseApiDate(schedule.dia_cadastrado))),
  );
  const today = new Date();
  const cells = buildCalendarCells(year, month);
  const yearOptions = Array.from({ length: 6 }, (_, index) => today.getFullYear() - 3 + index);

  function goToPreviousMonth() {
    const date = new Date(year, month - 1, 1);
    onMonthChange(date.getMonth(), date.getFullYear());
  }

  function goToNextMonth() {
    const date = new Date(year, month + 1, 1);
    onMonthChange(date.getMonth(), date.getFullYear());
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goToPreviousMonth}
          aria-label="Mês anterior"
          className="rounded p-1 text-ink transition-colors hover:bg-primary-light"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(event) => onMonthChange(Number(event.target.value), year)}
            aria-label="Mês"
            className="rounded-md border border-border px-2 py-1 text-sm"
          >
            {MONTH_LABELS.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(event) => onMonthChange(month, Number(event.target.value))}
            aria-label="Ano"
            className="rounded-md border border-border px-2 py-1 text-sm"
          >
            {yearOptions.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Próximo mês"
          className="rounded p-1 text-ink transition-colors hover:bg-primary-light"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-1 text-xs font-semibold text-muted">
            {label}
          </span>
        ))}

        {cells.map((cell, index) => {
          if (!cell) {
            return <span key={`empty-${index}`} />;
          }

          if (cell.muted) {
            return (
              <span key={toApiDateString(cell.date)} className="py-2 text-sm text-gray-300">
                {cell.date.getDate()}
              </span>
            );
          }

          const dateKey = toApiDateString(cell.date);
          const isRegistered = registeredDays.has(dateKey);
          const isToday = cell.date.toDateString() === today.toDateString();

          return (
            <button
              key={dateKey}
              type="button"
              disabled={isRegistered}
              onClick={() => onSelectDay(cell.date)}
              title={isRegistered ? 'Horas já registradas neste dia' : 'Registrar horas'}
              className={`rounded-md py-2 text-sm transition-colors ${
                isRegistered
                  ? 'cursor-not-allowed bg-primary-dark font-bold text-white'
                  : 'text-ink hover:bg-primary-light'
              } ${isToday && !isRegistered ? 'ring-1 ring-primary' : ''}`}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
