import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    user_name: '',
    user_mail: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsLoading(true)

    try {
      const res = await register({
        user_name: form.user_name,
        user_mail: form.user_mail,
        password: form.password,
      })

      // L'API retourne { resultat: "success" } — vérification du contenu
      if (res.resultat === 'success') {
        navigate('/login')
      } else {
        setError('Une erreur est survenue lors de l\'inscription.')
      }
    } catch {
      setError('Impossible de créer le compte. Cet email ou nom est peut-être déjà utilisé.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white">Thiskord</h1>
          <p className="text-gray-400 mt-2 text-sm">Créez votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Nom d'utilisateur
            </label>
            <input
              className="input"
              type="text"
              value={form.user_name}
              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              className="input"
              type="email"
              value={form.user_mail}
              onChange={(e) => setForm({ ...form, user_mail: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Mot de passe
            </label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              className="input"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}