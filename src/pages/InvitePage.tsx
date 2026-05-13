import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { invitesApi } from '@/api/invites'

/**
 * Page /invite/:token
 * Accepte l'invitation puis redirige vers /app.
 */
export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) return

    invitesApi
      .accept(token)
      .then(() => {
        setStatus('success')
        setTimeout(() => navigate('/app'), 2000)
      })
      .catch(() => setStatus('error'))
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="card text-center max-w-sm w-full">
        {status === 'loading' && (
          <p className="text-gray-300">Validation de l'invitation...</p>
        )}
        {status === 'success' && (
          <>
            <p className="text-green-400 font-medium">Invitation acceptée !</p>
            <p className="text-gray-400 text-sm mt-1">
              Redirection en cours...
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-red-400 font-medium">Invitation invalide</p>
            <p className="text-gray-400 text-sm mt-1">
              Ce lien est expiré ou déjà utilisé.
            </p>
            <button
              className="btn-secondary mt-4"
              onClick={() => navigate('/app')}
            >
              Retour à l'application
            </button>
          </>
        )}
      </div>
    </div>
  )
}