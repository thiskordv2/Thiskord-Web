import { api } from '@/lib/axios'
import type { Sprint, CreateSprintRequest, UpdateSprintRequest } from '@/types'

type RawSprint = {
  sprint_id?: number
  id?: number
  sprint_goal?: string | null
  sprint_begin_date?: string | null
  sprint_end_date?: string | null
  id_project_sprint?: number
  projectId?: number
}

const mapSprint = (sprint: RawSprint): Sprint => ({
  sprint_id: sprint.sprint_id ?? sprint.id ?? 0,
  sprint_goal: sprint.sprint_goal ?? '',
  sprint_begin_date: sprint.sprint_begin_date ?? '',
  sprint_end_date: sprint.sprint_end_date ?? '',
  id_project_sprint: sprint.id_project_sprint ?? sprint.projectId ?? 0,
})

export const sprintsApi = {
  /** GET /api/Sprint/sprint/project/:projectId */
  getByProject: async (projectId: number): Promise<Sprint[]> => {
    const res = await api.get<RawSprint[]>(`/Sprint/sprint/project/${projectId}`)
    return res.data.map(mapSprint)
  },

  /** GET /api/Sprint/sprint/:id */
  getById: async (id: number): Promise<Sprint> => {
    const res = await api.get<RawSprint>(`/Sprint/sprint/${id}`)
    return mapSprint(res.data)
  },

  /** POST /api/Sprint/create/sprint */
  create: async (data: CreateSprintRequest): Promise<Sprint> => {
    const res = await api.post<RawSprint>('/Sprint/create/sprint', data)
    return mapSprint(res.data)
  },

  /** PATCH /api/Sprint/sprint */
  update: async (data: UpdateSprintRequest): Promise<void> => {
    await api.patch('/Sprint/sprint', data)
  },

  /** DELETE /api/Sprint/:id */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Sprint/${id}`)
  },
}