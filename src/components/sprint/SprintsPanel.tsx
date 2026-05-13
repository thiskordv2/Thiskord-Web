import { useState } from 'react'
import { useSprints, useCreateSprint, useDeleteSprint } from '@/hooks/useSprints'
import type { Project, Sprint } from '@/types'

/**
 * Panneau droit — onglet Sprints.
 * Liste les sprints du projet actif avec création et suppression.
 */
export function SprintsPanel({ project }: { project: Project }) {
  const { data: sprints = [], isLoading } = useSprints(project.project_id)
  const createSprint = useCreateSprint()
  const deleteSprint = useDeleteSprint()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    sprint_goal: '',
    sprint_begin_date: '',
    sprint_end_date: '',
  })

  const handleCreate = async () => {
    if (!form.sprint_goal || !form.sprint_begin_date || !form.sprint_end_date) return
    await createSprint.mutateAsync({
      ...form,
      id_project_sprint: project.project_id,
    })
    setShowForm(false)
    setForm({ sprint_goal: '', sprint_begin_date: '', sprint_end_date: '' })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-200">Sprints</h3>
        <button
          className="text-indigo-400 text-sm hover:text-indigo-300"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Nouveau'}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="card space-y-2 max-w-full overflow-hidden">
          <input
            className="input text-sm w-full min-w-0"
            placeholder="Objectif du sprint"
            value={form.sprint_goal}
            onChange={(e) => setForm({ ...form, sprint_goal: e.target.value })}
          />
          <div className="grid grid-cols-1 gap-2">
            <div className="min-w-0">
              <label className="block text-xs text-gray-500">Début</label>
              <input
                className="input text-sm w-full min-w-0"
                type="date"
                value={form.sprint_begin_date}
                onChange={(e) => setForm({ ...form, sprint_begin_date: e.target.value })}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs text-gray-500">Fin</label>
              <input
                className="input text-sm w-full min-w-0"
                type="date"
                value={form.sprint_end_date}
                onChange={(e) => setForm({ ...form, sprint_end_date: e.target.value })}
              />
            </div>
          </div>
          <button
            className="btn-primary w-full text-sm"
            onClick={handleCreate}
            disabled={createSprint.isPending}
          >
            Créer le sprint
          </button>
        </div>
      )}

      {/* Liste */}
      {isLoading && (
        <p className="text-gray-600 text-sm">Chargement...</p>
      )}

      {sprints.map((sprint: Sprint) => (
        <SprintCard
          key={sprint.sprint_id}
          sprint={sprint}
          onDelete={() =>
            deleteSprint.mutate({
              id: sprint.sprint_id,
              projectId: project.project_id,
            })
          }
        />
      ))}

      {!isLoading && sprints.length === 0 && (
        <p className="text-gray-600 text-sm">Aucun sprint créé</p>
      )}
    </div>
  )
}

function SprintCard({
  sprint,
  onDelete,
}: {
  sprint: Sprint
  onDelete: () => void
}) {
  return (
    <div className="card space-y-1">
      <div className="flex items-start justify-between gap-2">
        <p className="text-gray-200 text-sm font-medium">{sprint.sprint_goal}</p>
        <button
          className="text-gray-600 hover:text-red-400 text-xs flex-shrink-0"
          onClick={onDelete}
        >
          ✕
        </button>
      </div>
      <p className="text-gray-500 text-xs">
        {sprint.sprint_begin_date} → {sprint.sprint_end_date}
      </p>
    </div>
  )
}