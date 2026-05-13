import { useRef, useEffect, useState, type KeyboardEvent } from 'react'
import { useChat } from '@/hooks/useChat'
import { MessageItem } from './MessageItem'
import type { Channel } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { Hash, SendHorizonal, MessageSquare } from 'lucide-react'

/**
 * Panneau de chat pour un canal donné.
 * - Se connecte au hub SignalR via useChat
 * - Affiche l'historique et les nouveaux messages
 * - Input d'envoi avec Entrée
 */
export function ChatPanel({ channel }: { channel: Channel }) {
  const user = useAuthStore((s) => s.user)
  const { messages, isConnected, isLoading, sendMessage, deleteMessage, editMessage } = useChat(
    channel.channel_id,
  )
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du canal */}
      <header
        className="px-5 py-3 flex items-center gap-2.5"
        style={{
          borderBottom: '1px solid var(--color-border-subtle)',
          background: 'rgba(16, 16, 28, 0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Hash className="w-4.5 h-4.5" style={{ color: 'var(--color-accent-violet-light)' }} />
        <h2 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {channel.name}
        </h2>
        {channel.description && (
          <>
            <span style={{ color: 'var(--color-border-medium)' }}>·</span>
            <span
              className="text-sm truncate"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {channel.description}
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <div
            className={isConnected ? 'glow-dot' : ''}
            style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '9999px',
              background: isConnected
                ? 'var(--color-status-success)'
                : 'var(--color-text-muted)',
            }}
            title={isConnected ? 'Connecté' : 'Déconnecté'}
          />
        </div>
      </header>

      {/* Zone de messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div
              className="w-6 h-6 rounded-full border-2"
              style={{
                borderColor: 'var(--color-surface-3)',
                borderTopColor: 'var(--color-accent-violet)',
                animation: 'spin 0.7s linear infinite',
              }}
            />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="text-center py-16" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div
              className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(34,211,238,0.08))',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <MessageSquare className="w-6 h-6" style={{ color: 'var(--color-accent-violet-light)' }} />
            </div>
            <p className="font-semibold text-gradient">
              Début de #{channel.name}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Envoyez le premier message
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isGrouped={i > 0 && messages[i - 1].user === msg.user}
            onDelete={deleteMessage}
            onEdit={editMessage}
            currentUser={user?.user_name ?? ''}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Zone de saisie */}
      <div className="px-4 pb-4">
        <div
          className="rounded-xl flex items-end gap-2 px-3 py-2 transition-all duration-200"
          style={{
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-medium)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-focus)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-medium)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <textarea
            className="flex-1 bg-transparent text-sm resize-none outline-none min-h-[20px] max-h-32 py-1"
            style={{
              color: 'var(--color-text-primary)',
              fontFamily: 'inherit',
            }}
            placeholder={`Écrire dans #${channel.name}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={!isConnected}
          />
          <button
            className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 disabled:opacity-30"
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))'
                : 'var(--color-surface-3)',
              color: 'white',
              border: 'none',
              cursor: input.trim() && isConnected ? 'pointer' : 'default',
            }}
            onClick={handleSend}
            disabled={!isConnected || !input.trim()}
          >
            <SendHorizonal className="w-4 h-4" />
          </button>
        </div>
        {!isConnected && (
          <p
            className="text-xs mt-1.5 flex items-center gap-1.5"
            style={{
              color: 'var(--color-status-error)',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--color-status-error)' }}
            />
            Connexion perdue — reconnexion en cours...
          </p>
        )}
      </div>
    </div>
  )
}