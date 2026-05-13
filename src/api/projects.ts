import { api } from '@/lib/axios'
import type { Project, CreateProjectRequest } from '@/types'

type RawProject = {
  id?: number
  project_id?: number
  name?: string | null
  description?: string | null
}

const mapProject = (project: RawProject): Project => ({
  project_id: project.project_id ?? project.id ?? 0,
  name: project.name ?? '',
  description: project.description ?? '',
})

export const projectsApi = {
  /** GET /api/Project/all */
  getAll: async (): Promise<Project[]> => {
    const res = await api.get<RawProject[]>('/Project/all')
    return res.data.map(mapProject)
  },

  /** POST /api/Project/create */
  create: async (data: CreateProjectRequest): Promise<Project> => {
    const res = await api.post<RawProject>('/Project/create', data)
    return mapProject(res.data)
  },

  /** PUT /api/Project/:id */
  update: async (id: number, data: CreateProjectRequest): Promise<void> => {
    await api.put(`/Project/${id}`, data)
  },

  /** DELETE /api/Project/:id */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Project/${id}`)
  },

  /** GET /api/User/project/:projectId — membres du projet */
  getMembers: async (projectId: number) => {
    const res = await api.get(`/User/project/${projectId}`)
    return res.data
  },
}