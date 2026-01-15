import { useMemo } from 'react'

export default function DatePicker({ selectedDates, onDateToggle }) {
  const { weeks, monthLabel } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dates = []
    for (let i = 0; i < 35; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    // Group into weeks
    const weeks = []
    let currentWeek = []

    // Pad first week with empty slots
    const firstDayOfWeek = dates[0].getDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null)
    }

    dates.forEach((date) => {
      currentWeek.push(date)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null)
      }
      weeks.push(currentWeek)
    }

    // Get month label
    const months = dates.reduce((acc, d) => {
      const month = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      if (!acc.includes(month)) acc.push(month)
      return acc
    }, [])
    const monthLabel = months.join(' - ')

    return { weeks, monthLabel }
  }, [])

  const formatDateStr = (date) => {
    return date.toISOString().split('T')[0]
  }

  const isSelected = (date) => {
    return selectedDates.has(formatDateStr(date))
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div>
      <div className="text-center font-medium text-gray-700 mb-4">
        {monthLabel}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
        {weeks.flat().map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dateStr = formatDateStr(date)
          const selected = isSelected(date)
          const isToday = formatDateStr(new Date()) === dateStr

          return (
            <button
              key={dateStr}
              onClick={() => onDateToggle(dateStr)}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                transition-colors duration-150
                ${selected
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
