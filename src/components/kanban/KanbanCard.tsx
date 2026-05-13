import { useSortable } from '@dnd-kit/sortable'
import type { SprintTask, TaskStatus } from '@/types'
import { useUpdateTask } from '@/hooks/useTasks'

interface Props {
  task: SprintTask
}

const STATUS_LABELS: Record<SprintTask['task_status'], string> = {
  todo: 'À faire',
  'in-progress': 'En cours',
  done: 'Terminé',
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

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-gray-800 bg-gray-900/90 p-3 shadow-sm shadow-black/20 ${
        isDragging ? 'opacity-60 ring-2 ring-indigo-500/60' : 'hover:border-gray-700'
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-medium text-gray-100 leading-snug">
          {task.task_title}
        </h4>
        <span className="shrink-0 rounded-full bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-gray-300">
          {STATUS_LABELS[task.task_status]}
        </span>
      </div>
      {/* Status selector */}
      <select
        className="ml-2 rounded bg-gray-800 px-1 py-0.5 text-xs text-gray-200"
        value={task.task_status}
        onChange={handleStatusChange}
        disabled={updateTask.isPending}
      >
        <option value="todo">À faire</option>
        <option value="in-progress">En cours</option>
        <option value="done">Terminé</option>
      </select>

      {task.task_desc && (
        <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-3">
          {task.task_desc}
        </p>
      )}
    </article>
  )
}