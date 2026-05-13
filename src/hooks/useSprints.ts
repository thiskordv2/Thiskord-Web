import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sprintsApi } from '@/api/sprints'
import type { CreateSprintRequest, UpdateSprintRequest } from '@/types'

export const sprintKeys = {
  byProject: (projectId: number) => ['sprints', projectId] as const,
}

export function useSprints(projectId: number | null) {
  return useQuery({
    queryKey: sprintKeys.byProject(projectId!),
    queryFn: () => sprintsApi.getByProject(projectId!),
    enabled: !!projectId,
  })
}

export function useCreateSprint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSprintRequest) => sprintsApi.create(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: sprintKeys.byProject(variables.id_project_sprint),
      })
    },
  })
}

export function useUpdateSprint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateSprintRequest) => sprintsApi.update(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: sprintKeys.byProject(variables.id_project_sprint),
      })
    },
  })
}

export function useDeleteSprint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, projectId }: { id: number; projectId: number }) =>
      sprintsApi.delete(id).then(() => projectId),
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: sprintKeys.byProject(projectId as number) })
    },
  })
}