import { Sidebar } from '../components/layout/Sidebar'
import { ChatPanel } from '../components/chat/ChatPanel'
import { RightPanel } from '../components/layout/RightPanel'
import { useAppStore } from '@/store/appStore'

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
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Panneau gauche : navigation */}
      <Sidebar />

      {/* Zone centrale : chat */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeChannel ? (
          <ChatPanel channel={activeChannel} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium text-gray-400">
                {activeProject
                  ? 'Sélectionnez un canal'
                  : 'Sélectionnez un projet'}
              </p>
              <p className="text-sm mt-1">
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