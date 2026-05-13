import { api } from '@/lib/axios'
import type { InviteRequest, InviteResponse } from '@/types'

type RawInviteResponse = {
  token?: string | null
  inviteToken?: string | null
  link?: string | null
  id?: number
  projectId?: number
  creatorId?: number
  createdAt?: string
  expiresAt?: string | null
}

const mapInviteResponse = (invite: RawInviteResponse): InviteResponse => {
  const token = invite.token ?? invite.inviteToken ?? ''
  const link =
    invite.link ||
    (token ? `/invite/${token}` : '')
  return { token, link }
}

export const invitesApi = {
  /** POST /api/Invite — génère un lien d'invitation */
  create: async (data: InviteRequest): Promise<InviteResponse> => {
    const res = await api.post<RawInviteResponse>('/Invite', data)
    return mapInviteResponse(res.data)
  },

  /** POST /api/Invite/:token — rejoindre via token */
  accept: async (token: string): Promise<void> => {
    await api.post(`/Invite/${token}`)
  },
}