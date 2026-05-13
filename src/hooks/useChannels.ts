import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { channelsApi } from '@/api/channels'
import type { CreateChannelRequest } from '@/types'

export const channelKeys = {
  byProject: (projectId: number) => ['channels', projectId] as const,
}

export function useChannels(projectId: number | null) {
  return useQuery({
    queryKey: channelKeys.byProject(projectId!),
    queryFn: () => channelsApi.getByProject(projectId!),
    enabled: !!projectId,
  })
}

export function useCreateChannel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateChannelRequest) => channelsApi.create(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: channelKeys.byProject(variables.projectId) })
    },
  })
}

export function useDeleteChannel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, projectId }: { id: number; projectId: number }) =>
      channelsApi.delete(id).then(() => projectId),
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: channelKeys.byProject(projectId as number) })
    },
  })
}