import { Sidebar } from '../components/layout/Sidebar'
import { ChatPanel } from '../components/chat/ChatPanel'
import { RightPanel } from '../components/layout/RightPanel'
import { useAppStore } from '@/store/appStore'
import { Hash, FolderKanban } from 'lucide-react'

/**
 * Layout principal de l'application : [Sidebar | Chat | Panneau droit].
 *
 * Structure :
 *   - Sidebar (240px) : projets + canaux
 *   - ChatPanel (flex-1) : messagerie temps réel
 *   - RightPanel (320px) : kanban / sprints / membres (contextuel)
 */
export default function AppPage() {
  const activeChannel = useAppStore((s) => s.activeChannel)
  const activeProject = useAppStore((s) => s.activeProject)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg-deep)' }}>
      {/* Panneau gauche : navigation */}
      <Sidebar />

      {/* Zone centrale : chat */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeChannel ? (
          <ChatPanel channel={activeChannel} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div
              className="text-center"
              style={{ animation: 'fadeIn 0.5s ease' }}
            >
              <div
                className="mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(34,211,238,0.1))',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {activeProject ? (
                  <Hash className="w-7 h-7" style={{ color: 'var(--color-accent-violet-light)' }} />
                ) : (
                  <FolderKanban className="w-7 h-7" style={{ color: 'var(--color-accent-violet-light)' }} />
                )}
              </div>
              <p
                className="text-lg font-semibold text-gradient"
              >
                {activeProject
                  ? 'Sélectionnez un canal'
                  : 'Sélectionnez un projet'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {activeProject
                  ? 'Choisissez un canal dans la sidebar pour démarrer'
                  : 'Choisissez un projet dans la sidebar'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Panneau droit : contexte projet */}
      {activeProject && <RightPanel project={activeProject} />}
    </div>
  )
}