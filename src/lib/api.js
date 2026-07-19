async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed (${res.status})`)
  }
  return res.json()
}

export const api = {
  createCalendar: (name) =>
    request('/calendars', { method: 'POST', body: JSON.stringify({ name }) }),
  getCalendar: (id) => request(`/calendars/${id}`),
  getInvitees: (calendarId) => request(`/calendars/${calendarId}/invitees`),
  addInvitee: (calendarId, name) =>
    request(`/calendars/${calendarId}/invitees`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  getCalendarAvailability: (calendarId) =>
    request(`/calendars/${calendarId}/availability`),
  getRespondData: (token) => request(`/respond/${token}`),
  setAvailability: (token, date, available) =>
    request(`/respond/${token}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ date, available }),
    }),
}
