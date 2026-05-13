import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { UserPlus } from 'lucide-react'

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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--color-bg-deep)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div
        className="w-full max-w-sm relative z-10"
        style={{ animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient">Thiskord</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Créez votre compte
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card space-y-5"
          style={{
            boxShadow: '0 16px 64px rgba(0,0,0,0.3), 0 0 80px rgba(139,92,246,0.05)',
          }}
        >
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
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
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <input
              className="input"
              type="email"
              value={form.user_mail}
              onChange={(e) => setForm({ ...form, user_mail: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
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
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
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

          {error && (
            <p
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                color: 'var(--color-status-error)',
                background: 'rgba(248, 113, 113, 0.08)',
                border: '1px solid rgba(248, 113, 113, 0.15)',
                animation: 'fadeIn 0.25s ease',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <UserPlus className="w-4 h-4" />
            {isLoading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--color-text-muted)' }}>
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-medium transition-colors duration-200"
            style={{ color: 'var(--color-accent-violet-light)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-cyan)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-accent-violet-light)' }}
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}