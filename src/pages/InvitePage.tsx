import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { invitesApi } from '@/api/invites'
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) return
    invitesApi.accept(token)
      .then(() => { setStatus('success'); setTimeout(() => navigate('/app'), 2000) })
      .catch(() => setStatus('error'))
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg-deep)' }}>
      <div className="card text-center max-w-sm w-full" style={{ boxShadow: '0 16px 64px rgba(0,0,0,0.3)', animation: 'slideUp 0.4s ease' }}>
        {status === 'loading' && (
          <div className="py-4">
            <div className="mx-auto w-10 h-10 rounded-full border-2 mb-4" style={{ borderColor: 'var(--color-surface-3)', borderTopColor: 'var(--color-accent-violet)', animation: 'spin 0.7s linear infinite' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Validation de l'invitation...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="py-4" style={{ animation: 'fadeIn 0.4s ease' }}>
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-status-success)' }} />
            <p className="font-semibold text-lg" style={{ color: 'var(--color-status-success)' }}>Invitation acceptée !</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Redirection en cours...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="py-4" style={{ animation: 'fadeIn 0.4s ease' }}>
            <XCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-status-error)' }} />
            <p className="font-semibold text-lg" style={{ color: 'var(--color-status-error)' }}>Invitation invalide</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Ce lien est expiré ou déjà utilisé.</p>
            <button className="btn-secondary mt-5 mx-auto flex items-center gap-2" onClick={() => navigate('/app')}>
              Retour <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}