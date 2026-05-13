import { useAppStore } from '@/store/appStore'
import { MembersPanel } from '../project/MembersPanel'
import { SprintsPanel } from '../sprint/SprintsPanel'
import { KanbanPanel } from '../kanban/KanbanPanel'
import { CalendarDays, Columns3, Users } from 'lucide-react'
import type { Project } from '@/types'

const TABS = [
  { id: 'sprints', label: 'Sprints', icon: CalendarDays },
  { id: 'kanban', label: 'Kanban', icon: Columns3 },
  { id: 'members', label: 'Membres', icon: Users },
] as const

type Panel = (typeof TABS)[number]['id']

export function RightPanel({ project }: { project: Project }) {
  const { rightPanel, setRightPanel } = useAppStore()

  return (
    <aside
      className="w-80 flex-shrink-0 flex flex-col h-full"
      style={{
        background: 'var(--color-surface-1)',
        borderLeft: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Tabs */}
      <div
        className="flex"
        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        {TABS.map((tab) => {
          const isActive = rightPanel === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all duration-200 relative"
              style={{
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-surface-2)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--color-text-secondary)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--color-text-muted)'
              }}
              onClick={() => setRightPanel(tab.id as Panel)}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--color-accent-violet), var(--color-accent-cyan))',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Contenu */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{ animation: 'fadeIn 0.25s ease' }}
      >
        {rightPanel === 'sprints' && <SprintsPanel project={project} />}
        {rightPanel === 'kanban' && <KanbanPanel project={project} />}
        {rightPanel === 'members' && <MembersPanel project={project} />}
      </div>
    </aside>
  )
}