import { useState, type FormEvent } from 'react'
import { useCreateProject } from '@/hooks/useProjects'

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card w-full max-w-sm">
        <h2 className="font-semibold text-gray-100 mb-4">Nouveau projet</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nom</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Description
            </label>
            <textarea
              className="input resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
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