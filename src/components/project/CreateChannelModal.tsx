import { useState, type FormEvent } from 'react'
import { useCreateChannel } from '@/hooks/useChannels'
import { Hash } from 'lucide-react'
import type { Project } from '@/types'

interface Props {
  project: Project
  onClose: () => void
}

export function CreateChannelModal({ project, onClose }: Props) {
  const createChannel = useCreateChannel()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await createChannel.mutateAsync({
      name,
      description,
      projectId: project.project_id,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(139,92,246,0.1))',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <Hash className="w-4.5 h-4.5" style={{ color: 'var(--color-accent-cyan)' }} />
          </div>
          <h2 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            Nouveau canal
          </h2>
        </div>
        <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
          Dans {project.name}
        </p>

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
              placeholder="general"
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Description
            </label>
            <input
              className="input"
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
              disabled={createChannel.isPending}
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}