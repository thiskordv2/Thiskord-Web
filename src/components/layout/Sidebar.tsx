import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useAuthStore } from '@/store/authStore'
import { useProjects } from '@/hooks/useProjects'
import { useChannels } from '@/hooks/useChannels'
import { CreateProjectModal } from '../project/CreateProjectModal'
import { CreateChannelModal } from '../project/CreateChannelModal'
import { JoinProjectModal } from '../project/JoinProjectModal'
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
      <aside className="w-60 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
        {/* En-tête utilisateur */}
        <div className="p-4 border-b border-gray-800">
          <button
            className="flex items-center gap-3 w-full hover:bg-gray-800 rounded-lg p-2 transition-colors"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {user?.user_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span className="text-sm font-medium text-gray-200 truncate">
              {user?.user_name}
            </span>
          </button>
        </div>

        {/* Liste des projets */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Projets
              </span>
              <div className="flex gap-1">
                <button
                  className="text-gray-500 hover:text-gray-300 text-lg leading-none"
                  onClick={() => setShowCreateProject(true)}
                  title="Nouveau projet"
                >
                  +
                </button>
                <button
                  className="text-gray-500 hover:text-gray-300 text-sm leading-none"
                  onClick={() => setShowJoinProject(true)}
                  title="Rejoindre un projet"
                >
                  🔗
                </button>
              </div>
            </div>

            {loadingProjects && (
              <p className="text-gray-600 text-xs px-2">Chargement...</p>
            )}

            {projects.map((project) => (
              <button
                key={project.project_id}
                className={`btn-ghost text-sm truncate ${
                  activeProject?.project_id === project.project_id
                    ? 'bg-gray-700 text-white'
                    : ''
                }`}
                onClick={() => handleSelectProject(project)}
              >
                # {project.name}
              </button>
            ))}
          </div>

          {/* Canaux du projet actif */}
          {activeProject && (
            <div className="p-3 border-t border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Canaux
                </span>
                <button
                  className="text-gray-500 hover:text-gray-300 text-lg leading-none"
                  onClick={() => setShowCreateChannel(true)}
                  title="Nouveau canal"
                >
                  +
                </button>
              </div>

              {channels.map((channel) => (
                <button
                  key={channel.channel_id}
                  className={`btn-ghost text-sm truncate ${
                    activeChannel?.channel_id === channel.channel_id
                      ? 'bg-gray-700 text-white'
                      : ''
                  }`}
                  onClick={() => setActiveChannel(channel)}
                >
                  # {channel.name}
                </button>
              ))}

              {channels.length === 0 && (
                <p className="text-gray-600 text-xs px-2">Aucun canal</p>
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