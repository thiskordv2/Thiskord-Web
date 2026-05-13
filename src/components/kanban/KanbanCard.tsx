import { useSortable } from '@dnd-kit/sortable'
import type { SprintTask, TaskStatus } from '@/types'
import { useUpdateTask } from '@/hooks/useTasks'

interface Props {
  task: SprintTask
}

const STATUS_CONFIG: Record<SprintTask['task_status'], { label: string; color: string; bg: string; border: string }> = {
  todo: {
    label: 'À faire',
    color: 'var(--color-text-secondary)',
    bg: 'rgba(136, 136, 164, 0.1)',
    border: 'rgba(136, 136, 164, 0.2)',
  },
  'in-progress': {
    label: 'En cours',
    color: 'var(--color-status-warning)',
    bg: 'rgba(251, 191, 36, 0.08)',
    border: 'rgba(251, 191, 36, 0.2)',
  },
  done: {
    label: 'Terminé',
    color: 'var(--color-status-success)',
    bg: 'rgba(52, 211, 153, 0.08)',
    border: 'rgba(52, 211, 153, 0.2)',
  },
}

export function KanbanCard({ task }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.task_id })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scaleX}, ${transform.scaleY})`
      : undefined,
    transition,
  }

  const updateTask = useUpdateTask()
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus
    if (newStatus === task.task_status) return
    const payload = { ...task, task_status: newStatus }
    updateTask.mutate(payload)
  }

  const cfg = STATUS_CONFIG[task.task_status]

  return (
    <article
      ref={setNodeRef}
      style={{
        ...style,
        background: isDragging ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
        border: `1px solid ${isDragging ? 'var(--color-accent-violet)' : 'var(--color-border-subtle)'}`,
        borderLeft: `3px solid ${cfg.color}`,
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDragging
          ? '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(139,92,246,0.1)'
          : '0 1px 3px rgba(0,0,0,0.1)',
      }}
      className="rounded-lg p-3 transition-all duration-200 hover:border-[var(--color-border-medium)]"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-3">
        <h4
          className="text-sm font-medium leading-snug"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {task.task_title}
        </h4>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium"
          style={{
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Status selector */}
      <select
        className="mt-2 rounded-lg px-1.5 py-0.5 text-xs"
        style={{
          background: 'var(--color-surface-1)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)',
          fontFamily: 'inherit',
          outline: 'none',
        }}
        value={task.task_status}
        onChange={handleStatusChange}
        disabled={updateTask.isPending}
      >
        <option value="todo">À faire</option>
        <option value="in-progress">En cours</option>
        <option value="done">Terminé</option>
      </select>

      {task.task_desc && (
        <p
          className="mt-2 text-sm leading-relaxed line-clamp-3"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {task.task_desc}
        </p>
      )}
    </article>
  )
}