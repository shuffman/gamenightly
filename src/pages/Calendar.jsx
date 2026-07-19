import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import InviteeForm from '../components/InviteeForm'
import InviteeList from '../components/InviteeList'
import AvailabilityGrid from '../components/AvailabilityGrid'

export default function Calendar() {
  const { id } = useParams()
  const [calendar, setCalendar] = useState(null)
  const [invitees, setInvitees] = useState([])
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCalendarData()
  }, [id])

  const loadCalendarData = async () => {
    setLoading(true)
    setError(null)

    try {
      const calendarData = await api.getCalendar(id)
      setCalendar(calendarData)

      const [inviteesData, availabilityData] = await Promise.all([
        api.getInvitees(id),
        api.getCalendarAvailability(id),
      ])
      setInvitees(inviteesData || [])
      setAvailability(availabilityData || [])
    } catch {
      setError('Calendar not found')
    }

    setLoading(false)
  }

  const handleInviteeAdded = (newInvitee) => {
    setInvitees([...invitees, newInvitee])
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-2">{calendar.name}</h2>
        <p className="text-gray-600">
          Add your friends below and share their unique links so they can mark
          their availability.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Add Invitees</h3>
        <InviteeForm calendarId={id} onInviteeAdded={handleInviteeAdded} />
      </div>

      {invitees.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Invitees ({invitees.length})
          </h3>
          <InviteeList invitees={invitees} />
        </div>
      )}

      {invitees.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Group Availability</h3>
          {availability.length > 0 ? (
            <AvailabilityGrid invitees={invitees} availability={availability} />
          ) : (
            <p className="text-gray-600">
              No responses yet. Share the links above with your invitees!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
