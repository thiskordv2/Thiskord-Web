import { useState, type FormEvent } from 'react'
import { useCreateTask } from '@/hooks/useTasks'
import { useAuthStore } from '@/store/authStore'
import { ListTodo, AlignLeft } from 'lucide-react'
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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <h2
          className="mb-1 font-semibold text-lg"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Nouvelle tâche
        </h2>
        <p className="mb-5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Dans {project.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <ListTodo className="w-3.5 h-3.5" />
              Titre
            </label>
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
            <label className="mb-1.5 flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <AlignLeft className="w-3.5 h-3.5" />
              Description
            </label>
            <textarea
              className="input min-h-[96px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails, critères d'acceptation, contexte..."
            />
          </div>

          <div
            className="rounded-lg px-3 py-2.5 text-sm"
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Statut initial : <span style={{ color: 'var(--color-text-primary)' }}>{defaultStatus}</span>
          </div>

          <div className="flex gap-2 pt-1">
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