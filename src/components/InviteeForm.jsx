import { useState } from 'react'
import { supabase } from '../lib/supabase'

function generateToken() {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
}

export default function InviteeForm({ calendarId, onInviteeAdded }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError(null)

    const token = generateToken()

    const { data, error: insertError } = await supabase
      .from('invitees')
      .insert([{
        calendar_id: calendarId,
        name: name.trim(),
        token,
      }])
      .select()
      .single()

    if (insertError) {
      setError('Failed to add invitee. Please try again.')
      setLoading(false)
      return
    }

    setName('')
    setLoading(false)
    onInviteeAdded(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add'}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  )
}
