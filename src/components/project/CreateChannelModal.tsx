import { useState, type FormEvent } from 'react'
import { useCreateChannel } from '@/hooks/useChannels'
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card w-full max-w-sm">
        <h2 className="font-semibold text-gray-100 mb-1">Nouveau canal</h2>
        <p className="text-gray-500 text-sm mb-4">Dans {project.name}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nom</label>
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
            <label className="block text-sm text-gray-400 mb-1">
              Description
            </label>
            <input
              className="input"
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