import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-700">404</p>
        <p className="text-gray-400 mt-2">Page introuvable</p>
        <Link to="/app" className="btn-primary inline-block mt-4">
          Retour à l'application
        </Link>
      </div>
    </div>
  )
}