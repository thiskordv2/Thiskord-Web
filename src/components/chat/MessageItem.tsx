import { useState } from 'react'
import { Pencil, Trash2, Check, X, MoreHorizontal } from 'lucide-react'
import type { ChatMessage } from '@/types'
import { useIsMobile } from '@/hooks/useIsMobile'

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
  const [showMobileActions, setShowMobileActions] = useState(false)
  const isOwner = message.user === currentUser
  const isMobile = useIsMobile()

  const handleEditSubmit = () => {
    if (editContent.trim() && editContent !== message.text) {
      onEdit(message.id, editContent.trim())
    }
    setIsEditing(false)
    setShowMobileActions(false)
  }

  const content = isEditing ? (
    <div className="flex gap-2 mt-1">
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
      <button
        className="btn-icon"
        style={{ color: 'var(--color-status-success)' }}
        onClick={handleEditSubmit}
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        className="btn-icon"
        style={{ color: 'var(--color-text-muted)' }}
        onClick={() => setIsEditing(false)}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <p
      className="text-sm leading-relaxed mt-0.5"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {message.text}
    </p>
  )

  // Actions desktop (hover) ou mobile (bouton ⋯ + menu)
  const desktopActions = isOwner && !isEditing && (
    <div
      className="hidden group-hover:flex gap-0.5 flex-shrink-0"
      style={{ animation: 'fadeIn 0.15s ease' }}
    >
      <button
        className="btn-icon !w-7 !h-7"
        onClick={() => setIsEditing(true)}
        title="Modifier"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        className="btn-icon !w-7 !h-7"
        onClick={() => onDelete(message.id)}
        title="Supprimer"
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-status-error)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '' }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )

  // Sur mobile : bouton ⋯ qui ouvre un mini-menu inline
  const mobileActionBtn = isOwner && !isEditing && isMobile && (
    <div className="relative flex-shrink-0">
      <button
        className="btn-icon !w-7 !h-7"
        onClick={() => setShowMobileActions(!showMobileActions)}
        aria-label="Actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {showMobileActions && (
        <div
          className="absolute right-0 top-8 flex flex-col gap-1 rounded-xl p-1.5 z-10"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-medium)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.15s ease',
            minWidth: '120px',
          }}
        >
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            onClick={() => { setIsEditing(true); setShowMobileActions(false) }}
          >
            <Pencil className="w-3.5 h-3.5" /> Modifier
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--color-status-error)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            onClick={() => { onDelete(message.id); setShowMobileActions(false) }}
          >
            <Trash2 className="w-3.5 h-3.5" /> Supprimer
          </button>
        </div>
      )}
    </div>
  )

  const actions = isMobile ? mobileActionBtn : desktopActions

  if (isGrouped) {
    return (
      <div
        className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 px-2 py-0.5 rounded-lg group transition-colors duration-150"
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34, 34, 60, 0.3)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
      >
        <div className="w-8 h-8 flex-shrink-0" aria-hidden="true" />
        <div>
          {content}
          <span
            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {message.dateTime}
          </span>
        </div>
        {actions}
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-3 px-2 py-1.5 rounded-lg group transition-colors duration-150"
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34, 34, 60, 0.3)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent-violet-dark), var(--color-accent-violet))',
          color: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className="font-semibold text-sm"
            style={{ color: 'var(--color-accent-violet-light)' }}
          >
            {message.user}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {message.dateTime}
          </span>
        </div>
        {content}
      </div>
      {actions}
    </div>
  )
}