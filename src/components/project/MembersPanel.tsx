import { useState } from 'react'
import { useProjectMembers } from '@/hooks/useProjects'
import { invitesApi } from '@/api/invites'
import { Copy, Link2, Check } from 'lucide-react'
import type { Project } from '@/types'

/**
 * Panneau droit — onglet Membres.
 * Liste les membres du projet et génère un lien d'invitation.
 */
export function MembersPanel({ project }: { project: Project }) {
  const { data: members = [], isLoading } = useProjectMembers(project.project_id)
  const [inviteLink, setInviteLink] = useState('')
  const [generatingInvite, setGeneratingInvite] = useState(false)
  const [copied, setCopied] = useState(false)

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
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate a deterministic gradient from username
  const getAvatarGradient = (name: string) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hue1 = hash % 360
    const hue2 = (hue1 + 40) % 360
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 45%), hsl(${hue2}, 70%, 55%))`
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
        Membres de {project.name}
      </h3>

      {/* Liste des membres */}
      <div className="space-y-1">
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
        {members.map((member: { user_id: number; user_name: string; user_picture?: string }) => (
          <div
            key={member.user_id}
            className="flex items-center gap-3 py-2 px-2 rounded-lg transition-colors duration-150"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            {member.user_picture ? (
              <img
                src={member.user_picture}
                alt={member.user_name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                style={{ border: '1px solid var(--color-border-subtle)' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty('display', 'flex') }}
              />
            ) : null}
            <div
              className="w-8 h-8 rounded-full items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              style={{
                background: getAvatarGradient(member.user_name),
                display: member.user_picture ? 'none' : 'flex',
              }}
            >
              {member.user_name[0]?.toUpperCase()}
            </div>
            <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {member.user_name}
            </span>
          </div>
        ))}
      </div>

      {/* Invitation */}
      <div className="divider" />
      <div className="pt-1">
        <p className="text-xs mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
          <Link2 className="w-3.5 h-3.5" />
          Inviter quelqu'un
        </p>

        {inviteLink ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className="input text-xs flex-1"
                value={inviteLink}
                readOnly
              />
              <button
                className="btn-icon flex-shrink-0"
                onClick={copyInviteLink}
                title="Copier le lien"
                style={{
                  color: copied ? 'var(--color-status-success)' : 'var(--color-text-muted)',
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
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