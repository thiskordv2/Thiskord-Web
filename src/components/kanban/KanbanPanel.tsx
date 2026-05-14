import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSprints } from '@/hooks/useSprints'
import { useTasks, useUpdateTask } from '@/hooks/useTasks'
import { KanbanCard } from './KanbanCard'
import { CreateTaskModal } from './CreateTaskModal'
import { Plus, Circle, Clock, CheckCircle2 } from 'lucide-react'
import type { Project, SprintTask, TaskStatus } from '@/types'

const COLUMNS: { id: TaskStatus; label: string; icon: typeof Circle; color: string }[] = [
  { id: 'todo', label: 'À faire', icon: Circle, color: 'var(--color-text-secondary)' },
  { id: 'in-progress', label: 'En cours', icon: Clock, color: 'var(--color-status-warning)' },
  { id: 'done', label: 'Terminé', icon: CheckCircle2, color: 'var(--color-status-success)' },
]

function KanbanColumn({
  status,
  label,
  tasks,
  icon: Icon,
  color,
  onAddTask,
}: {
  status: TaskStatus
  label: string
  tasks: SprintTask[]
  icon: typeof Circle
  color: string
  onAddTask: (status: TaskStatus) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status}` })

  return (
    <div
      ref={setNodeRef}
      className="rounded-xl p-3 transition-all duration-200"
      style={{
        background: isOver ? 'rgba(139, 92, 246, 0.06)' : 'rgba(16, 16, 28, 0.4)',
        border: isOver
          ? '1px solid rgba(139, 92, 246, 0.3)'
          : '1px solid var(--color-border-subtle)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {label}
          </span>
          <span
            className="text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full"
            style={{
              background: 'var(--color-surface-3)',
              color: 'var(--color-text-muted)',
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          className="btn-icon !w-6 !h-6"
          onClick={() => onAddTask(status)}
          title="Ajouter une tâche"
          type="button"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <SortableContext
        id={`col-${status}`}
        items={tasks.map((task) => task.task_id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 min-h-[40px]">
          {tasks.map((task) => (
            <KanbanCard key={task.task_id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

/**
 * Panneau droit — onglet Kanban.
 * Sélecteur de sprint + board 3 colonnes avec drag & drop.
 */
export function KanbanPanel({ project }: { project: Project }) {
  const { data: sprints = [] } = useSprints(project.project_id)
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [createInStatus, setCreateInStatus] = useState<TaskStatus>('todo')

  const { data: tasks = [] } = useTasks(selectedSprintId)
  const updateTask = useUpdateTask()

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // Délai 200ms + tolérance 5px pour distinguer tap et drag
        delay: 200,
        tolerance: 5,
      },
    })
  )

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter((t: SprintTask) => t.task_status === status && !t.is_subtask)

  const getStatusFromTarget = (targetId: string) => {
    if (targetId.startsWith('col-')) {
      return targetId.replace('col-', '') as TaskStatus
    }

    return tasks.find((task) => task.task_id === Number(targetId))?.task_status
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Trouve la tâche déplacée
    const task = tasks.find((t: SprintTask) => t.task_id === Number(active.id))
    if (!task) return

    const targetStatus = getStatusFromTarget(String(over.id))
    if (!targetStatus) return
    if (task.task_status === targetStatus) return

    const updatePayload = {
      ...task,
      task_status: targetStatus,
    }
    updateTask.mutate(updatePayload, {
      onError: (err) => {
      },
      onSuccess: () => {
        console.log('✅ Tâche mise à jour avec succès')
      },
    })
  }

  return (
    <div className="space-y-4">
      {/* Sélecteur de sprint */}
      <div>
        <label
          className="text-xs block mb-1.5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Sprint
        </label>
        <select
          className="input text-sm"
          value={selectedSprintId ?? ''}
          onChange={(e) =>
            setSelectedSprintId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">— Choisir un sprint —</option>
          {sprints.map((s) => (
            <option key={s.sprint_id} value={s.sprint_id}>
              {s.sprint_goal}
            </option>
          ))}
        </select>
      </div>

      {!selectedSprintId && (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Sélectionnez un sprint pour afficher le kanban
        </p>
      )}

      {selectedSprintId && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-3">
            {COLUMNS.map((col) => {
              const colTasks = tasksByStatus(col.id)
              return (
                <KanbanColumn
                  key={col.id}
                  status={col.id}
                  label={col.label}
                  icon={col.icon}
                  color={col.color}
                  tasks={colTasks}
                  onAddTask={(status) => {
                    setCreateInStatus(status)
                    setShowCreateTask(true)
                  }}
                />
              )
            })}
          </div>
        </DndContext>
      )}

      {/* Modale création tâche */}
      {showCreateTask && selectedSprintId && (
        <CreateTaskModal
          project={project}
          sprintId={selectedSprintId}
          defaultStatus={createInStatus}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </div>
  )
}