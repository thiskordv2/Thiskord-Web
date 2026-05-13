import { useAppStore } from '@/store/appStore'
import { MembersPanel } from '../project/MembersPanel'
import { SprintsPanel } from '../sprint/SprintsPanel'
import { KanbanPanel } from '../kanban/KanbanPanel'
import type { Project } from '@/types'

const TABS = [
  { id: 'sprints', label: 'Sprints' },
  { id: 'kanban', label: 'Kanban' },
  { id: 'members', label: 'Membres' },
] as const

type Panel = (typeof TABS)[number]['id']

export function RightPanel({ project }: { project: Project }) {
  const { rightPanel, setRightPanel } = useAppStore()

  return (
    <aside className="w-80 flex-shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              rightPanel === tab.id
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            onClick={() => setRightPanel(tab.id as Panel)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-y-auto p-4">
        {rightPanel === 'sprints' && <SprintsPanel project={project} />}
        {rightPanel === 'kanban' && <KanbanPanel project={project} />}
        {rightPanel === 'members' && <MembersPanel project={project} />}
      </div>
    </aside>
  )
}