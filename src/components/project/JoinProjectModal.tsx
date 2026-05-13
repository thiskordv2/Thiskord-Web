import { useState, type FormEvent } from 'react'
import { invitesApi } from '@/api/invites'
import { useProjects } from '@/hooks/useProjects'
import { UserPlus } from 'lucide-react'

interface Props {
  onClose: () => void
}

export function JoinProjectModal({ onClose }: Props) {
  const { refetch } = useProjects()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await invitesApi.accept(token.trim())
      await refetch()
      onClose()
    } catch (err) {
      setError('Token invalide ou expiré')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(34,211,238,0.1))',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <UserPlus className="w-4.5 h-4.5" style={{ color: 'var(--color-accent-violet-light)' }} />
          </div>
          <h2 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            Rejoindre un projet
          </h2>
        </div>
        <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
          Entrez le token d'invitation pour rejoindre un projet
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Token
            </label>
            <input
              className="input"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Collez le token d'invitation"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-status-error)' }}>
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading || !token.trim()}
            >
              {isLoading ? 'Validation...' : 'Rejoindre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
