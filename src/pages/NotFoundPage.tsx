import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-bg-deep)' }}>
      <div className="text-center" style={{ animation: 'slideUp 0.5s ease' }}>
        <p className="not-found-404 text-8xl font-bold text-gradient" style={{ animation: 'float 4s ease-in-out infinite' }}>
          404
        </p>
        <p className="text-lg mt-4" style={{ color: 'var(--color-text-secondary)' }}>
          Page introuvable
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/app"
          className="btn-primary inline-flex items-center gap-2 mt-6"
        >
          <Home className="w-4 h-4" />
          Retour à l'application
        </Link>
      </div>
    </div>
  )
}