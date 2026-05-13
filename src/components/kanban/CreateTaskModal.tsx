import { useState, type FormEvent } from 'react'
import { useCreateTask } from '@/hooks/useTasks'
import { useAuthStore } from '@/store/authStore'
import type { Project, TaskStatus } from '@/types'

interface Props {
  project: Project
  sprintId: number
  defaultStatus: TaskStatus
  onClose: () => void
}

export function CreateTaskModal({
  project,
  sprintId,
  defaultStatus,
  onClose,
}: Props) {
  const createTask = useCreateTask()
  const user = useAuthStore((state) => state.user)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!user) return

    await createTask.mutateAsync({
      task_title: title,
      task_desc: description,
      is_subtask: false,
      task_status: defaultStatus,
      id_creator: user.user_id,
      id_resp: user.user_id,
      id_project_task: project.project_id,
      id_parent_task: null,
      id_sprint: sprintId,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="card w-full max-w-md">
        <h2 className="mb-1 font-semibold text-gray-100">Nouvelle tâche</h2>
        <p className="mb-4 text-sm text-gray-500">Dans {project.name}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Titre</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              placeholder="Décrire le livrable"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Description
            </label>
            <textarea
              className="input min-h-[96px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails, critères d’acceptation, contexte..."
            />
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-950/50 px-3 py-2 text-sm text-gray-400">
            Statut initial: <span className="text-gray-200">{defaultStatus}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={createTask.isPending || !user}
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}