import { api } from '@/lib/axios'
import type { Channel, CreateChannelRequest } from '@/types'

type RawChannel = {
  id?: number
  channel_id?: number
  name?: string | null
  description?: string | null
  id_project?: number
}

const mapChannel = (channel: RawChannel, projectId?: number): Channel => ({
  channel_id: channel.channel_id ?? channel.id ?? 0,
  name: channel.name ?? '',
  description: channel.description ?? '',
  id_project: channel.id_project ?? projectId ?? 0,
})

export const channelsApi = {
  /** GET /api/Channel/project/:projectId */
  getByProject: async (projectId: number): Promise<Channel[]> => {
    const res = await api.get<RawChannel[]>(`/Channel/project/${projectId}`)
    return res.data.map((channel) => mapChannel(channel, projectId))
  },

  /** POST /api/Channel/create */
  create: async (data: CreateChannelRequest): Promise<Channel> => {
    const res = await api.post<RawChannel>('/Channel/create', data)
    return mapChannel(res.data, data.projectId)
  },

  /** PUT /api/Channel/:id */
  update: async (id: number, data: Partial<CreateChannelRequest>): Promise<void> => {
    await api.put(`/Channel/${id}`, data)
  },

  /** DELETE /api/Channel/:id */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Channel/${id}`)
  },
}