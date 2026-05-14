import { useAppStore } from '@/store/appStore'
import { FolderOpen, MessageSquare, LayoutDashboard, Users } from 'lucide-react'

/**
 * Barre de navigation fixe en bas pour mobile (< 768px).
 * Affichée via CSS uniquement sur mobile (.mobile-nav).
 * 4 onglets : Projets (sidebar), Chat, Board (right panel), Membres.
 */
export function MobileNav() {
  const {
    activeProject,
    mobileActiveView,
    rightPanel,
    setMobileActiveView,
    setRightPanel,
    toggleMobileSidebar,
    mobileSidebarOpen,
  } = useAppStore()

  const handleProjects = () => {
    toggleMobileSidebar()
  }

  const handleChat = () => {
    setMobileActiveView('chat')
  }

  const handleBoard = () => {
    setMobileActiveView('right-panel')
    // Garde l'onglet actif du panneau droit
    if (rightPanel === 'chat') setRightPanel('sprints')
  }

  const handleMembers = () => {
    setMobileActiveView('right-panel')
    setRightPanel('members')
  }

  const isBoardActive = mobileActiveView === 'right-panel' && rightPanel !== 'members'
  const isMembersActive = mobileActiveView === 'right-panel' && rightPanel === 'members'

  return (
    <nav className="mobile-nav" role="navigation" aria-label="Navigation mobile">
      <div className="mobile-nav-inner">
        {/* Projets */}
        <button
          className={`mobile-nav-btn ${mobileSidebarOpen ? 'active' : ''}`}
          onClick={handleProjects}
          aria-label="Projets"
        >
          <FolderOpen style={{ width: '1.25rem', height: '1.25rem' }} />
          Projets
        </button>

        {/* Chat */}
        <button
          className={`mobile-nav-btn ${mobileActiveView === 'chat' && !mobileSidebarOpen ? 'active' : ''}`}
          onClick={handleChat}
          aria-label="Chat"
          disabled={!activeProject}
        >
          <MessageSquare style={{ width: '1.25rem', height: '1.25rem' }} />
          Chat
        </button>

        {/* Board (Sprints / Kanban) */}
        <button
          className={`mobile-nav-btn ${isBoardActive && !mobileSidebarOpen ? 'active' : ''}`}
          onClick={handleBoard}
          aria-label="Board"
          disabled={!activeProject}
        >
          <LayoutDashboard style={{ width: '1.25rem', height: '1.25rem' }} />
          Board
        </button>

        {/* Membres */}
        <button
          className={`mobile-nav-btn ${isMembersActive && !mobileSidebarOpen ? 'active' : ''}`}
          onClick={handleMembers}
          aria-label="Membres"
          disabled={!activeProject}
        >
          <Users style={{ width: '1.25rem', height: '1.25rem' }} />
          Membres
        </button>
      </div>
    </nav>
  )
}
