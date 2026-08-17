import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CalendarDay } from './CalendarDay'
import { buildCalendarGrid, MONTH_LABELS, nextMonth, previousMonth, WEEKDAY_LABELS } from '../../utils/dateHelpers'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 3 + i)

export function CalendarView({ month, onMonthChange, markedKeys, selectedKey, onSelectDay }) {
  const days = buildCalendarGrid(month)

  function handleMonthSelect(event) {
    onMonthChange(new Date(month.getFullYear(), Number(event.target.value), 1))
  }

  function handleYearSelect(event) {
    onMonthChange(new Date(Number(event.target.value), month.getMonth(), 1))
  }

  return (
    <div className="rounded-xl border-2 border-primary-500 p-4">
      <div className="mb-3 flex items-center justify-between gap-1">
        <button
          type="button"
          aria-label="Mês anterior"
          onClick={() => onMonthChange(previousMonth(month))}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5">
          <select
            aria-label="Selecionar mês"
            value={month.getMonth()}
            onChange={handleMonthSelect}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 capitalize outline-none focus:ring-2 focus:ring-primary-500"
          >
            {MONTH_LABELS.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          <select
            aria-label="Selecionar ano"
            value={month.getFullYear()}
            onChange={handleYearSelect}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          aria-label="Próximo mês"
          onClick={() => onMonthChange(nextMonth(month))}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center text-xs text-gray-400">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 place-items-center gap-y-1">
        {days.map((day) => (
          <CalendarDay
            key={day.key}
            day={day}
            isMarked={markedKeys.has(day.key)}
            isSelected={day.key === selectedKey}
            onClick={onSelectDay}
          />
        ))}
      </div>
    </div>
  )
}
