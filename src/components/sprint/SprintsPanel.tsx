import { useState } from 'react'
import { useSprints, useCreateSprint, useDeleteSprint } from '@/hooks/useSprints'
import { Plus, Trash2, CalendarDays, Target } from 'lucide-react'
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
        <h3 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Sprints
        </h3>
        <button
          className="flex items-center gap-1.5 text-sm transition-colors duration-200"
          style={{
            color: showForm ? 'var(--color-text-muted)' : 'var(--color-accent-violet-light)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            'Annuler'
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Nouveau
            </>
          )}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div
          className="card space-y-3 max-w-full overflow-hidden"
          style={{ animation: 'slideUp 0.25s ease' }}
        >
          <div>
            <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
              <Target className="w-3 h-3" />
              Objectif
            </label>
            <input
              className="input text-sm w-full min-w-0"
              placeholder="Objectif du sprint"
              value={form.sprint_goal}
              onChange={(e) => setForm({ ...form, sprint_goal: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="min-w-0">
              <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                <CalendarDays className="w-3 h-3" />
                Début
              </label>
              <input
                className="input text-sm w-full min-w-0"
                type="date"
                value={form.sprint_begin_date}
                onChange={(e) => setForm({ ...form, sprint_begin_date: e.target.value })}
              />
            </div>
            <div className="min-w-0">
              <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                <CalendarDays className="w-3 h-3" />
                Fin
              </label>
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
        <div className="flex items-center justify-center py-6">
          <div
            className="w-5 h-5 rounded-full border-2"
            style={{
              borderColor: 'var(--color-surface-3)',
              borderTopColor: 'var(--color-accent-violet)',
              animation: 'spin 0.7s linear infinite',
            }}
          />
        </div>
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
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Aucun sprint créé
        </p>
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
    <div
      className="card space-y-1.5"
      style={{
        borderLeft: '3px solid var(--color-accent-violet)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {sprint.sprint_goal}
        </p>
        <button
          className="btn-icon !w-6 !h-6 flex-shrink-0"
          onClick={onDelete}
          title="Supprimer"
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-status-error)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '' }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <CalendarDays className="w-3 h-3" style={{ color: 'var(--color-text-muted)' }} />
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {sprint.sprint_begin_date} → {sprint.sprint_end_date}
        </p>
      </div>
    </div>
  )
}