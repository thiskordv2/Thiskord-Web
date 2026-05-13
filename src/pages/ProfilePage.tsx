import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { accountApi } from '@/api/account'
import { ArrowLeft, User, Lock, LogOut, CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * Page /profile
 * Permet de modifier nom, email, avatar et mot de passe.
 * Appelle POST /api/Account/account et POST /api/Account/account-password.
 */
export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    user_name: user?.user_name ?? '',
    user_mail: user?.user_mail ?? '',
    user_picture: user?.user_picture ?? '',
    user_password: '',
    newPassword: '',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  if (!user) return null

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await accountApi.update({
        user_id: user.user_id,
        user_name: form.user_name,
        user_mail: form.user_mail,
        user_picture: form.user_picture,
        user_password: form.user_password,
      })
      setSuccess('Profil mis à jour.')
    } catch {
      setError('Impossible de mettre à jour le profil.')
    }
  }

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await accountApi.updatePassword({
        user_id: user.user_id,
        user_name: form.user_name,
        user_mail: form.user_mail,
        user_picture: form.user_picture,
        user_password: form.newPassword,
      })
      setSuccess('Mot de passe mis à jour.')
    } catch {
      setError('Impossible de mettre à jour le mot de passe.')
    }
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: 'var(--color-bg-deep)' }}
    >
      <div
        className="max-w-lg mx-auto space-y-6"
        style={{ animation: 'fadeIn 0.4s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))',
                color: 'white',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.25)',
              }}
            >
              {user.user_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {user.user_name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {user.user_mail}
              </p>
            </div>
          </div>
          <button
            className="btn-secondary flex items-center gap-1.5 text-sm"
            onClick={() => navigate('/app')}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>

        {/* Feedback messages */}
        {success && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{
              color: 'var(--color-status-success)',
              background: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.15)',
              animation: 'slideUp 0.25s ease',
            }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {success}
          </div>
        )}
        {error && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{
              color: 'var(--color-status-error)',
              background: 'rgba(248, 113, 113, 0.08)',
              border: '1px solid rgba(248, 113, 113, 0.15)',
              animation: 'slideUp 0.25s ease',
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Formulaire profil */}
        <form onSubmit={handleUpdateProfile} className="card space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4" style={{ color: 'var(--color-accent-violet-light)' }} />
            <h2 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Informations
            </h2>
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Nom d'utilisateur
            </label>
            <input
              className="input"
              value={form.user_name}
              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <input
              className="input"
              type="email"
              value={form.user_mail}
              onChange={(e) => setForm({ ...form, user_mail: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              URL avatar (optionnel)
            </label>
            <input
              className="input"
              value={form.user_picture}
              onChange={(e) => setForm({ ...form, user_picture: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Mot de passe actuel (requis pour modifier)
            </label>
            <input
              className="input"
              type="password"
              value={form.user_password}
              onChange={(e) => setForm({ ...form, user_password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary">
            Enregistrer
          </button>
        </form>

        {/* Formulaire mot de passe */}
        <form onSubmit={handleUpdatePassword} className="card space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4" style={{ color: 'var(--color-accent-cyan)' }} />
            <h2 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Changer le mot de passe
            </h2>
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Nouveau mot de passe
            </label>
            <input
              className="input"
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary">
            Mettre à jour
          </button>
        </form>

        {/* Déconnexion */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <LogOut className="w-4 h-4" style={{ color: 'var(--color-status-error)' }} />
            <h2 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Session
            </h2>
          </div>
          <button
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200"
            style={{
              background: 'rgba(248, 113, 113, 0.08)',
              color: 'var(--color-status-error)',
              border: '1px solid rgba(248, 113, 113, 0.15)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(248, 113, 113, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.15)'
            }}
            onClick={async () => {
              await logout()
              navigate('/login')
            }}
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}