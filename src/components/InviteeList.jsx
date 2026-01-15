import { useState } from 'react'

export default function InviteeList({ invitees }) {
  const [copiedToken, setCopiedToken] = useState(null)

  const getInviteUrl = (token) => {
    return `${window.location.origin}/respond/${token}`
  }

  const copyToClipboard = async (token) => {
    const url = getInviteUrl(token)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <ul className="divide-y divide-gray-200">
      {invitees.map((invitee) => (
        <li
          key={invitee.id}
          className="py-3 flex items-center justify-between"
        >
          <span className="font-medium">{invitee.name}</span>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 max-w-xs truncate hidden sm:block">
              {getInviteUrl(invitee.token)}
            </code>
            <button
              onClick={() => copyToClipboard(invitee.token)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              {copiedToken === invitee.token ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
