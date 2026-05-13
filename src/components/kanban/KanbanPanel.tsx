import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  MouseSensor,
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
import type { Project, SprintTask, TaskStatus } from '@/types'

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'À faire' },
  { id: 'in-progress', label: 'En cours' },
  { id: 'done', label: 'Terminé' },
]

function KanbanColumn({
  status,
  label,
  tasks,
  onAddTask,
}: {
  status: TaskStatus
  label: string
  tasks: SprintTask[]
  onAddTask: (status: TaskStatus) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${status}` })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border border-gray-800/80 bg-gray-950/40 p-3 transition-colors ${
        isOver ? 'border-indigo-500/60 bg-indigo-950/20' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{tasks.length}</span>
          <button
            className="text-gray-600 hover:text-gray-300 text-sm"
            onClick={() => onAddTask(status)}
            title="Ajouter une tâche"
            type="button"
          >
            +
          </button>
        </div>
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
        <label className="text-xs text-gray-500 block mb-1">Sprint</label>
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
        <p className="text-gray-600 text-sm">
          Sélectionnez un sprint pour afficher le kanban
        </p>
      )}

      {selectedSprintId && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            {COLUMNS.map((col) => {
              const colTasks = tasksByStatus(col.id)
              return (
                <KanbanColumn
                  key={col.id}
                  status={col.id}
                  label={col.label}
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