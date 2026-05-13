import { useState } from 'react'
import type { ChatMessage } from '@/types'

interface Props {
  message: ChatMessage
  isGrouped: boolean
  onDelete: (id: number) => void
  onEdit: (id: number, newContent: string) => void
  currentUser: string
}

export function MessageItem({ message, isGrouped, onDelete, onEdit, currentUser }: Props) {
  const initials = message.user?.[0]?.toUpperCase() ?? '?'
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.text)
  const isOwner = message.user === currentUser

  const handleEditSubmit = () => {
    if (editContent.trim() && editContent !== message.text) {
      onEdit(message.id, editContent.trim())
    }
    setIsEditing(false)
  }

  const content = isEditing ? (
    <div className="flex gap-2 mt-0.5">
      <input
        className="input text-sm flex-1"
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleEditSubmit()
          if (e.key === 'Escape') setIsEditing(false)
        }}
        autoFocus
      />
      <button className="btn-primary text-xs px-2" onClick={handleEditSubmit}>OK</button>
      <button className="btn-secondary text-xs px-2" onClick={() => setIsEditing(false)}>✕</button>
    </div>
  ) : (
    <p className="text-gray-100 text-sm leading-relaxed mt-0.5">{message.text}</p>
  )

  const actions = isOwner && !isEditing && (
    <div className="hidden group-hover:flex gap-1 flex-shrink-0">
      <button
        className="text-gray-500 hover:text-gray-300 text-xs px-1.5 py-0.5 rounded hover:bg-gray-700"
        onClick={() => setIsEditing(true)}
        title="Modifier"
      >
        ✏️
      </button>
      <button
        className="text-gray-500 hover:text-red-400 text-xs px-1.5 py-0.5 rounded hover:bg-gray-700"
        onClick={() => onDelete(message.id)}
        title="Supprimer"
      >
        🗑️
      </button>
    </div>
  )

  if (isGrouped) {
    return (
      <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 hover:bg-gray-800/40 px-2 py-0.5 rounded group">
        <div className="w-8 h-8 flex-shrink-0" aria-hidden="true" />
        <div>
          {content}
          <span className="text-gray-700 text-xs opacity-0 group-hover:opacity-100">
            {message.dateTime}
          </span>
        </div>
        {actions}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 hover:bg-gray-800/40 px-2 py-1 rounded group">
      <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 text-xs font-medium flex-shrink-0 mt-0.5">
        {initials}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-gray-200 text-sm">{message.user}</span>
          <span className="text-gray-600 text-xs">{message.dateTime}</span>
        </div>
        {content}
      </div>
      {actions}
    </div>
  )
}