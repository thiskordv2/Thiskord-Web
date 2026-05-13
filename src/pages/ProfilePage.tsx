import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { accountApi } from '@/api/account'

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
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Mon profil</h1>
          <button className="btn-ghost text-sm" onClick={() => navigate('/app')}>
            ← Retour
          </button>
        </div>

        {/* Formulaire profil */}
        <form onSubmit={handleUpdateProfile} className="card space-y-4">
          <h2 className="font-medium text-gray-200">Informations</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Nom d'utilisateur
            </label>
            <input
              className="input"
              value={form.user_name}
              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              className="input"
              type="email"
              value={form.user_mail}
              onChange={(e) => setForm({ ...form, user_mail: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
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
            <label className="block text-sm text-gray-400 mb-1">
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
          <h2 className="font-medium text-gray-200">Changer le mot de passe</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
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

        {success && <p className="text-green-400 text-sm">{success}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Déconnexion */}
        <div className="card">
          <h2 className="font-medium text-gray-200 mb-3">Session</h2>
          <button
            className="btn-secondary text-red-400 hover:text-red-300"
            onClick={async () => {
              await logout()
              navigate('/login')
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  )
}