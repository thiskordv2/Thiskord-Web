import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useAuthStore } from '@/store/authStore'
import { useProjects } from '@/hooks/useProjects'
import { useChannels } from '@/hooks/useChannels'
import { CreateProjectModal } from '../project/CreateProjectModal'
import { CreateChannelModal } from '../project/CreateChannelModal'
import { JoinProjectModal } from '../project/JoinProjectModal'
import { Plus, Link2, Hash, User, FolderOpen } from 'lucide-react'
import type { Project } from '@/types'

/**
 * Sidebar gauche :
 * - En-tête avec avatar utilisateur + lien profil
 * - Liste des projets
 * - Liste des canaux du projet actif
 */
export function Sidebar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { activeProject, activeChannel, setActiveProject, setActiveChannel } =
    useAppStore()

  const { data: projects = [], isLoading: loadingProjects } = useProjects()
  const { data: channels = [] } = useChannels(activeProject?.project_id ?? null)

  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [showJoinProject, setShowJoinProject] = useState(false)

  const handleSelectProject = (project: Project) => {
    setActiveProject(project)
    setActiveChannel(null)
  }

  return (
    <>
      <aside
        className="w-60 flex-shrink-0 flex flex-col h-full"
        style={{
          background: 'var(--color-surface-1)',
          borderRight: '1px solid var(--color-border-subtle)',
        }}
      >
        {/* En-tête utilisateur */}
        <div
          className="p-4"
          style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
        >
          <button
            className="flex items-center gap-3 w-full rounded-xl p-2 transition-all duration-200"
            onClick={() => navigate('/profile')}
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-cyan))',
              }}
            >
              {user?.user_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span
                className="text-sm font-medium truncate"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {user?.user_name}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Mon profil
              </span>
            </div>
            <User className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>

        {/* Liste des projets */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <span
                className="text-[0.65rem] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Projets
              </span>
              <div className="flex gap-0.5">
                <button
                  className="btn-icon !w-6 !h-6"
                  onClick={() => setShowCreateProject(true)}
                  title="Nouveau projet"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  className="btn-icon !w-6 !h-6"
                  onClick={() => setShowJoinProject(true)}
                  title="Rejoindre un projet"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {loadingProjects && (
              <p className="text-xs px-2" style={{ color: 'var(--color-text-muted)' }}>
                Chargement...
              </p>
            )}

            <div className="space-y-0.5">
              {projects.map((project) => {
                const isActive = activeProject?.project_id === project.project_id
                return (
                  <button
                    key={project.project_id}
                    className="flex items-center gap-2 w-full text-left text-sm truncate rounded-lg px-2.5 py-1.5 transition-all duration-200"
                    style={{
                      color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      background: isActive ? 'var(--color-surface-3)' : 'transparent',
                      borderLeft: isActive
                        ? '2px solid var(--color-accent-violet)'
                        : '2px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'var(--color-surface-hover)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent'
                    }}
                    onClick={() => handleSelectProject(project)}
                  >
                    <FolderOpen className="w-4 h-4 flex-shrink-0" style={{
                      color: isActive ? 'var(--color-accent-violet-light)' : 'var(--color-text-muted)'
                    }} />
                    <span className="truncate">{project.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Canaux du projet actif */}
          {activeProject && (
            <div
              className="p-3"
              style={{
                borderTop: '1px solid var(--color-border-subtle)',
                animation: 'fadeIn 0.25s ease',
              }}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span
                  className="text-[0.65rem] font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Canaux
                </span>
                <button
                  className="btn-icon !w-6 !h-6"
                  onClick={() => setShowCreateChannel(true)}
                  title="Nouveau canal"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0.5">
                {channels.map((channel) => {
                  const isActive = activeChannel?.channel_id === channel.channel_id
                  return (
                    <button
                      key={channel.channel_id}
                      className="flex items-center gap-2 w-full text-left text-sm truncate rounded-lg px-2.5 py-1.5 transition-all duration-200"
                      style={{
                        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        background: isActive ? 'var(--color-surface-3)' : 'transparent',
                        borderLeft: isActive
                          ? '2px solid var(--color-accent-cyan)'
                          : '2px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'var(--color-surface-hover)'
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent'
                      }}
                      onClick={() => setActiveChannel(channel)}
                    >
                      <Hash className="w-3.5 h-3.5 flex-shrink-0" style={{
                        color: isActive ? 'var(--color-accent-cyan)' : 'var(--color-text-muted)'
                      }} />
                      <span className="truncate">{channel.name}</span>
                    </button>
                  )
                })}
              </div>

              {channels.length === 0 && (
                <p className="text-xs px-2" style={{ color: 'var(--color-text-muted)' }}>
                  Aucun canal
                </p>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Modales */}
      {showCreateProject && (
        <CreateProjectModal onClose={() => setShowCreateProject(false)} />
      )}
      {showJoinProject && (
        <JoinProjectModal onClose={() => setShowJoinProject(false)} />
      )}
      {showCreateChannel && activeProject && (
        <CreateChannelModal
          project={activeProject}
          onClose={() => setShowCreateChannel(false)}
        />
      )}
    </>
  )
}