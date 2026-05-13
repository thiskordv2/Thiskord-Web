import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '@/api/tasks'
import type { CreateTaskRequest, UpdateTaskRequest } from '@/types'

export const taskKeys = {
  bySprint: (sprintId: number) => ['tasks', sprintId] as const,
  subtasks: (parentId: number) => ['tasks', 'subtasks', parentId] as const,
}

export function useTasks(sprintId: number | null) {
  return useQuery({
    queryKey: taskKeys.bySprint(sprintId!),
    queryFn: () => tasksApi.getBySprint(sprintId!),
    enabled: !!sprintId,
  })
}

export function useSubtasks(parentId: number | null) {
  return useQuery({
    queryKey: taskKeys.subtasks(parentId!),
    queryFn: () => tasksApi.getSubtasks(parentId!),
    enabled: !!parentId,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskRequest) => tasksApi.create(data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: taskKeys.bySprint(variables.id_sprint) })
      if (variables.id_parent_task) {
        qc.invalidateQueries({
          queryKey: taskKeys.subtasks(variables.id_parent_task),
        })
      }
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTaskRequest) => tasksApi.update(data),
    // After a successful status change, refetch all task queries to ensure UI reflects server state
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, sprintId }: { id: number; sprintId: number }) =>
      tasksApi.delete(id).then(() => sprintId),
    onSuccess: (sprintId) => {
      qc.invalidateQueries({ queryKey: taskKeys.bySprint(sprintId as number) })
    },
  })
}