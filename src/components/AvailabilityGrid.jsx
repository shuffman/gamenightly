import { useMemo } from 'react'

export default function AvailabilityGrid({ invitees, availability }) {
  const { dateData, sortedDates } = useMemo(() => {
    // Group availability by date
    const dateMap = new Map()

    availability.forEach((a) => {
      if (!a.available) return

      if (!dateMap.has(a.date)) {
        dateMap.set(a.date, new Set())
      }
      dateMap.get(a.date).add(a.invitee_id)
    })

    // Sort dates and only include dates with at least one available person
    const sortedDates = Array.from(dateMap.keys())
      .filter((date) => dateMap.get(date).size > 0)
      .sort()

    // Create date data with availability info
    const dateData = sortedDates.map((date) => {
      const availableInvitees = dateMap.get(date)
      const availableNames = invitees
        .filter((i) => availableInvitees.has(i.id))
        .map((i) => i.name)

      return {
        date,
        count: availableInvitees.size,
        names: availableNames,
        percentage: (availableInvitees.size / invitees.length) * 100,
      }
    })

    return { dateData, sortedDates }
  }, [invitees, availability])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const getColorClass = (percentage) => {
    if (percentage === 100) return 'bg-green-500'
    if (percentage >= 75) return 'bg-green-400'
    if (percentage >= 50) return 'bg-yellow-400'
    if (percentage >= 25) return 'bg-orange-400'
    return 'bg-red-400'
  }

  if (sortedDates.length === 0) {
    return (
      <p className="text-gray-600">
        No availability data yet. Waiting for responses...
      </p>
    )
  }

  // Sort by most available first
  const sortedData = [...dateData].sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-4">
        Dates sorted by availability ({invitees.length} people total)
      </div>
      {sortedData.map(({ date, count, names, percentage }) => (
        <div
          key={date}
          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
        >
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${getColorClass(percentage)}`}
          >
            {count}/{invitees.length}
          </div>
          <div className="flex-1">
            <div className="font-medium">{formatDate(date)}</div>
            <div className="text-sm text-gray-600">
              {names.join(', ')}
            </div>
          </div>
          {percentage === 100 && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              Everyone!
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
