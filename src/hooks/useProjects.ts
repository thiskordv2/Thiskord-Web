import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/api/projects'
import type { CreateProjectRequest } from '@/types'

export const projectKeys = {
  all: ['projects'] as const,
  members: (id: number) => ['projects', id, 'members'] as const,
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: projectsApi.getAll,
  })
}

export function useProjectMembers(projectId: number) {
  return useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => projectsApi.getMembers(projectId),
    enabled: !!projectId,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProjectRequest }) =>
      projectsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}