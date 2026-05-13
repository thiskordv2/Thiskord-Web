import { useState, type FormEvent } from 'react'
import { invitesApi } from '@/api/invites'
import { useProjects } from '@/hooks/useProjects'

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card w-full max-w-sm">
        <h2 className="font-semibold text-gray-100 mb-4">Rejoindre un projet</h2>
        <p className="text-sm text-gray-400 mb-4">
          Entrez le token d'invitation pour rejoindre un projet
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Token</label>
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
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
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
