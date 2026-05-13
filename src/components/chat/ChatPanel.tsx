import { useRef, useEffect, useState, type KeyboardEvent } from 'react'
import { useChat } from '@/hooks/useChat'
import { MessageItem } from './MessageItem'
import type { Channel } from '@/types'
import { useAuthStore } from '@/store/authStore'

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
      <header className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <span className="text-gray-400">#</span>
        <h2 className="font-semibold text-gray-100">{channel.name}</h2>
        {channel.description && (
          <>
            <span className="text-gray-700">·</span>
            <span className="text-gray-500 text-sm truncate">
              {channel.description}
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-600'
            }`}
            title={isConnected ? 'Connecté' : 'Déconnecté'}
          />
        </div>
      </header>

      {/* Zone de messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {isLoading && (
          <p className="text-gray-600 text-sm text-center py-8">
            Chargement des messages...
          </p>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 font-medium">
              Début de #{channel.name}
            </p>
            <p className="text-gray-600 text-sm mt-1">
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
        <div className="bg-gray-800 rounded-xl border border-gray-700 flex items-end gap-2 px-3 py-2">
          <textarea
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 text-sm resize-none outline-none min-h-[20px] max-h-32 py-1"
            placeholder={`Écrire dans #${channel.name}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={!isConnected}
          />
          <button
            className="btn-primary py-1 px-3 text-sm flex-shrink-0 disabled:opacity-40"
            onClick={handleSend}
            disabled={!isConnected || !input.trim()}
          >
            Envoyer
          </button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-400 mt-1">
            Connexion perdue — reconnexion en cours...
          </p>
        )}
      </div>
    </div>
  )
}