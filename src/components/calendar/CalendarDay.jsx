export function CalendarDay({ day, isMarked, isSelected, onClick }) {
  const base = 'flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors'

  let tone = 'text-gray-700 hover:bg-gray-100'
  if (!day.inCurrentMonth) tone = 'text-gray-300'
  if (isMarked) tone = 'bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200'
  if (isSelected) tone = 'bg-gray-900 text-white hover:bg-gray-900'

  return (
    <button
      type="button"
      onClick={() => onClick(day)}
      className={`${base} ${tone} ${day.isToday && !isSelected ? 'ring-1 ring-primary-500' : ''}`}
    >
      {day.date.getDate()}
    </button>
  )
}
