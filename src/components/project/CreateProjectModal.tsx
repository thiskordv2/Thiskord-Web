import { useState, type FormEvent } from 'react'
import { useCreateProject } from '@/hooks/useProjects'
import { FolderPlus } from 'lucide-react'

interface Props {
  onClose: () => void
}

export function CreateProjectModal({ onClose }: Props) {
  const createProject = useCreateProject()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await createProject.mutateAsync({ name, description })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(34,211,238,0.1))',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <FolderPlus className="w-4.5 h-4.5" style={{ color: 'var(--color-accent-violet-light)' }} />
          </div>
          <h2 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            Nouveau projet
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Nom
            </label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Description
            </label>
            <textarea
              className="input resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={createProject.isPending}
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}