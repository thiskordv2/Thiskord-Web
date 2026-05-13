import { useState, useEffect, useCallback, useRef } from 'react'
import { getHubConnection, startConnection } from '@/lib/signalr'
import type { ChatMessage } from '@/types'

type RawMessage = {
  Id?: number
  id?: number
  Content?: string | null
  content?: string | null
  CreatedAt?: string | null
  createdAt?: string | null
  Username?: string | null
  username?: string | null
}

const mapMessage = (message: RawMessage): ChatMessage => ({
  id: message.Id ?? message.id ?? 0,
  user: message.Username ?? message.username ?? 'Unknown',
  text: message.Content ?? message.content ?? '',
  dateTime: message.CreatedAt ?? message.createdAt ?? '',
})

/**
 * Hook qui gère la connexion SignalR pour un canal donné.
 * - Démarre la connexion si nécessaire
 * - Rejoint / quitte le canal
 * - Écoute les événements LoadMessages et ReceiveMessage
 */
export function useChat(channelId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isMountedRef = useRef(false)
  const currentChannelId = useRef<number | null>(null)
  const loadingTimeoutRef = useRef<number | null>(null)

  const clearLoadingTimeout = () => {
    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
  }

  const finishLoading = () => {
    clearLoadingTimeout()
    setIsLoading(false)
  }

  const joinChannel = async (nextChannelId: number) => {
    const conn = getHubConnection()

    if (currentChannelId.current !== null && currentChannelId.current !== nextChannelId) {
      await conn.invoke('LeaveChannel', currentChannelId.current).catch(console.error)
    }

    setIsLoading(true)
    setMessages([])
    clearLoadingTimeout()
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isMountedRef.current) {
        console.warn('LoadMessages timeout for channel', nextChannelId)
        finishLoading()
      }
    }, 8000)

    try {
      await conn.invoke('JoinChannel', nextChannelId)
      currentChannelId.current = nextChannelId
    } catch (error) {
      console.error('JoinChannel error:', error)
      currentChannelId.current = null
      if (isMountedRef.current) {
        finishLoading()
      }
    }
  }

  // Démarrage de la connexion et abonnements aux événements
  useEffect(() => {
    isMountedRef.current = true

    const init = async () => {
      try {
        await startConnection()
        const conn = getHubConnection()

        if (isMountedRef.current) setIsConnected(true)

        conn.off('ReceiveMessage')
        conn.on('ReceiveMessage', (_id: number, user: string, text: string, dateTime: string) => {
          if (isMountedRef.current) {
            setMessages((prev) => [...prev, { id: _id, user, text, dateTime }])
          }
        })

        conn.off('LoadMessages')
        conn.on('LoadMessages', (history: RawMessage[]) => {
          if (isMountedRef.current) {
            setMessages(history.map(mapMessage))
            finishLoading()
          }
        })

        conn.off('DeleteMessage')
        conn.on('DeleteMessage', (messageId: number) => {
          if (isMountedRef.current) {
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
          }
        })

        conn.off('EditMessage')
        conn.on('EditMessage', (messageId: number, newContent: string, newCreatedAt: string) => {
          if (isMountedRef.current) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? { ...msg, text: newContent, dateTime: newCreatedAt }
                  : msg,
              ),
            )
          }
        })

        conn.onclose(() => {
          if (isMountedRef.current) setIsConnected(false)
        })

        conn.onreconnected(() => {
          if (isMountedRef.current) setIsConnected(true)
          // Ré-rejoindre le canal après reconnexion
          if (currentChannelId.current !== null) {
            conn.invoke('JoinChannel', currentChannelId.current).catch(console.error)
          }
        })

        if (channelId !== null && currentChannelId.current !== channelId) {
          await joinChannel(channelId)
        }
      } catch (err) {
        console.error('SignalR connection error:', err)
      }
    }

    init()

    return () => {
      isMountedRef.current = false
      clearLoadingTimeout()
      const conn = getHubConnection()
      conn.off('LoadMessages')
      conn.off('ReceiveMessage')
      conn.off('DeleteMessage')
      conn.off('EditMessage')
      conn.off('UserJoined')
    }
  }, [])

  // Rejoindre / quitter un canal quand channelId change
  useEffect(() => {
    if (!isConnected) return

    if (channelId === null) {
      currentChannelId.current = null
      finishLoading()
      return
    }

    if (currentChannelId.current === channelId) return

    joinChannel(channelId)
  }, [channelId, isConnected])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!isConnected || !channelId || !text.trim()) return
      const conn = getHubConnection()
      await conn.invoke('SendMessage', channelId, text).catch(console.error)
    },
    [isConnected, channelId],
  )

  const deleteMessage = useCallback(
    async (messageId: number) => {
      if (!isConnected || !channelId) return
      const conn = getHubConnection()
      await conn.invoke('DeleteMessage', channelId, messageId).catch(console.error)
    },
    [isConnected, channelId],
  )

  const editMessage = useCallback(
    async (messageId: number, newContent: string) => {
      if (!isConnected || !channelId) return
      const conn = getHubConnection()
      await conn.invoke('EditMessage', channelId, messageId, newContent).catch(console.error)
    },
    [isConnected, channelId],
  )

  return { messages, isConnected, isLoading, sendMessage, deleteMessage, editMessage }
}