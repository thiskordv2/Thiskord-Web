import { useState } from 'react'
import { useProjectMembers } from '@/hooks/useProjects'
import { invitesApi } from '@/api/invites'
import type { Project } from '@/types'

/**
 * Panneau droit — onglet Membres.
 * Liste les membres du projet et génère un lien d'invitation.
 */
export function MembersPanel({ project }: { project: Project }) {
  const { data: members = [], isLoading } = useProjectMembers(project.project_id)
  const [inviteLink, setInviteLink] = useState('')
  const [generatingInvite, setGeneratingInvite] = useState(false)

  const generateInvite = async () => {
    setGeneratingInvite(true)
    try {
      const res = await invitesApi.create({ projectId: project.project_id })
      setInviteLink(res.link)
    } catch {
      setInviteLink('')
    } finally {
      setGeneratingInvite(false)
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-200">
        Membres de {project.name}
      </h3>

      {/* Liste des membres */}
      <div className="space-y-2">
        {isLoading && (
          <p className="text-gray-600 text-sm">Chargement...</p>
        )}
        {members.map((member: { user_id: number; user_name: string }) => (
          <div
            key={member.user_id}
            className="flex items-center gap-3 py-2"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 text-xs font-medium">
              {member.user_name[0]?.toUpperCase()}
            </div>
            <span className="text-gray-300 text-sm">{member.user_name}</span>
          </div>
        ))}
      </div>

      {/* Invitation */}
      <div className="border-t border-gray-800 pt-4">
        <p className="text-xs text-gray-500 mb-2">Inviter quelqu'un</p>

        {inviteLink ? (
          <div className="space-y-2">
            <input
              className="input text-xs"
              value={inviteLink}
              readOnly
            />
            <button className="btn-secondary w-full text-sm" onClick={copyInviteLink}>
              Copier le lien
            </button>
          </div>
        ) : (
          <button
            className="btn-primary w-full text-sm"
            onClick={generateInvite}
            disabled={generatingInvite}
          >
            {generatingInvite ? 'Génération...' : 'Générer un lien d\'invitation'}
          </button>
        )}
      </div>
    </div>
  )
}