import { Sidebar } from '../components/layout/Sidebar'
import { ChatPanel } from '../components/chat/ChatPanel'
import { RightPanel } from '../components/layout/RightPanel'
import { MobileNav } from '../components/layout/MobileNav'
import { useAppStore } from '@/store/appStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Hash, FolderKanban } from 'lucide-react'

/**
 * Layout principal de l'application.
 *
 * Desktop (>= 768px) : [Sidebar 240px | Chat flex-1 | RightPanel 320px]
 * Mobile  (< 768px)  : Un seul panneau visible à la fois + bottom nav
 *   - Sidebar en overlay coulissant depuis la gauche
 *   - Chat ou RightPanel selon mobileActiveView
 */
export default function AppPage() {
  const activeChannel = useAppStore((s) => s.activeChannel)
  const activeProject = useAppStore((s) => s.activeProject)
  const mobileSidebarOpen = useAppStore((s) => s.mobileSidebarOpen)
  const mobileActiveView = useAppStore((s) => s.mobileActiveView)
  const setMobileSidebarOpen = useAppStore((s) => s.setMobileSidebarOpen)
  const isMobile = useIsMobile()

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--color-bg-deep)' }}
    >
      {/* ────────────── DESKTOP : sidebar fixe ────────────── */}
      <div className="desktop-only">
        <Sidebar />
      </div>

      {/* ────────────── MOBILE : sidebar en overlay ────────────── */}
      {isMobile && mobileSidebarOpen && (
        <>
          {/* Fond semi-transparent */}
          <div
            className="mobile-sidebar-overlay"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Panneau sidebar coulissant */}
          <div className="mobile-sidebar-panel">
            <Sidebar isMobileOverlay />
          </div>
        </>
      )}

      {/* ────────────── ZONE PRINCIPALE ────────────── */}
      <main
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          // Sur mobile, laisser de la place pour la bottom nav
          paddingBottom: isMobile ? 'calc(60px + env(safe-area-inset-bottom, 0px))' : undefined,
        }}
      >
        {/* ── Contenu : selon mode desktop ou mobile ── */}
        {!isMobile ? (
          /* Desktop : chat toujours visible */
          activeChannel ? (
            <ChatPanel channel={activeChannel} />
          ) : (
            <EmptyState activeProject={activeProject} />
          )
        ) : (
          /* Mobile : panneau selon mobileActiveView */
          mobileActiveView === 'chat' ? (
            activeChannel ? (
              <ChatPanel channel={activeChannel} />
            ) : (
              <EmptyState activeProject={activeProject} />
            )
          ) : (
            /* right-panel sur mobile */
            activeProject ? (
              <div className="flex-1 overflow-y-auto p-4">
                <RightPanel project={activeProject} mobileFullscreen />
              </div>
            ) : (
              <EmptyState activeProject={null} />
            )
          )
        )}
      </main>

      {/* ────────────── DESKTOP : panneau droit ────────────── */}
      {!isMobile && activeProject && <RightPanel project={activeProject} />}

      {/* ────────────── MOBILE : bottom navigation bar ────────────── */}
      <MobileNav />
    </div>
  )
}

/** État vide : aucun projet ou canal sélectionné */
function EmptyState({ activeProject }: { activeProject: { name: string } | null }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center px-4" style={{ animation: 'fadeIn 0.5s ease' }}>
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
        <p className="text-lg font-semibold text-gradient">
          {activeProject ? 'Sélectionnez un canal' : 'Sélectionnez un projet'}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {activeProject
            ? 'Choisissez un canal dans la sidebar pour démarrer'
            : 'Choisissez un projet dans la sidebar'}
        </p>
      </div>
    </div>
  )
}