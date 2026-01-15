import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import DatePicker from '../components/DatePicker'

export default function Respond() {
  const { token } = useParams()
  const [invitee, setInvitee] = useState(null)
  const [calendar, setCalendar] = useState(null)
  const [selectedDates, setSelectedDates] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadInviteeData()
  }, [token])

  const loadInviteeData = async () => {
    setLoading(true)
    setError(null)

    // Load invitee by token
    const { data: inviteeData, error: inviteeError } = await supabase
      .from('invitees')
      .select('*, calendars(*)')
      .eq('token', token)
      .single()

    if (inviteeError || !inviteeData) {
      setError('Invalid link. Please check your invitation URL.')
      setLoading(false)
      return
    }

    setInvitee(inviteeData)
    setCalendar(inviteeData.calendars)

    // Load existing availability
    const { data: availabilityData } = await supabase
      .from('availability')
      .select('*')
      .eq('invitee_id', inviteeData.id)

    if (availabilityData) {
      const dates = new Set(
        availabilityData.filter((a) => a.available).map((a) => a.date)
      )
      setSelectedDates(dates)
    }

    setLoading(false)
  }

  const handleDateToggle = async (dateStr) => {
    const newSelectedDates = new Set(selectedDates)
    const isCurrentlySelected = newSelectedDates.has(dateStr)

    if (isCurrentlySelected) {
      newSelectedDates.delete(dateStr)
    } else {
      newSelectedDates.add(dateStr)
    }

    setSelectedDates(newSelectedDates)
    setSaving(true)
    setSaved(false)

    // Upsert availability
    const { error: upsertError } = await supabase.from('availability').upsert(
      {
        invitee_id: invitee.id,
        date: dateStr,
        available: !isCurrentlySelected,
      },
      {
        onConflict: 'invitee_id,date',
      }
    )

    if (upsertError) {
      // Revert on error
      if (isCurrentlySelected) {
        newSelectedDates.add(dateStr)
      } else {
        newSelectedDates.delete(dateStr)
      }
      setSelectedDates(newSelectedDates)
      console.error('Failed to save:', upsertError)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }

    setSaving(false)
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-2">{calendar.name}</h2>
        <p className="text-gray-600">
          Hi <span className="font-medium">{invitee.name}</span>! Select the
          dates when you're available for game night.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Availability</h3>
          <div className="text-sm">
            {saving && <span className="text-gray-500">Saving...</span>}
            {saved && <span className="text-green-600">Saved!</span>}
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Click on dates to mark yourself as available (green) or unavailable.
        </p>
        <DatePicker
          selectedDates={selectedDates}
          onDateToggle={handleDateToggle}
        />
      </div>

      <div className="text-center text-gray-500 text-sm">
        {selectedDates.size} date{selectedDates.size !== 1 ? 's' : ''} selected
      </div>
    </div>
  )
}
