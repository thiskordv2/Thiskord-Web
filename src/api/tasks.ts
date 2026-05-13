import { api } from '@/lib/axios'
import type { SprintTask, CreateTaskRequest, UpdateTaskRequest } from '@/types'

type RawSprintTask = {
  task_id?: number
  id?: number
  task_title?: string | null
  task_desc?: string | null
  is_subtask?: boolean
  task_status?: string | null
  id_creator?: number
  id_resp?: number
  id_project_task?: number
  id_parent_task?: number | null
  id_sprint?: number
}

const normalizeTaskStatus = (status: string | null | undefined): SprintTask['task_status'] => {
  if (status === 'in-progress' || status === 'done' || status === 'todo') {
    return status
  }
  return 'todo'
}

const mapTask = (task: RawSprintTask): SprintTask => ({
  task_id: task.task_id ?? task.id ?? 0,
  task_title: task.task_title ?? '',
  task_desc: task.task_desc ?? '',
  is_subtask: task.is_subtask ?? false,
  task_status: normalizeTaskStatus(task.task_status),
  id_creator: task.id_creator ?? 0,
  id_resp: task.id_resp ?? 0,
  id_project_task: task.id_project_task ?? 0,
  id_parent_task: task.id_parent_task ?? null,
  id_sprint: task.id_sprint ?? 0,
})

export const tasksApi = {
  /** GET /api/SprintTask/sprint/task/:sprintId */
  getBySprint: async (sprintId: number): Promise<SprintTask[]> => {
    const res = await api.get<RawSprintTask[]>(`/SprintTask/sprint/task/${sprintId}`)
    return res.data.map(mapTask)
  },

  /** GET /api/SprintTask/parent/task/:parentId */
  getSubtasks: async (parentId: number): Promise<SprintTask[]> => {
    const res = await api.get<RawSprintTask[]>(`/SprintTask/parent/task/${parentId}`)
    return res.data.map(mapTask)
  },

  /** POST /api/SprintTask/task */
  create: async (data: CreateTaskRequest): Promise<SprintTask> => {
    const res = await api.post<RawSprintTask>('/SprintTask/task', data)
    return mapTask(res.data)
  },

  /** PATCH /api/SprintTask/task */
  update: async (data: UpdateTaskRequest): Promise<void> => {
    // Backend expects all fields (same as POST) plus task_id
    const payload = {
      task_id: data.task_id,
      task_title: data.task_title,
      task_desc: data.task_desc,
      is_subtask: data.is_subtask,
      task_status: data.task_status,
      id_creator: data.id_creator,
      id_resp: data.id_resp,
      id_project_task: data.id_project_task,
      id_parent_task: data.id_parent_task,
      id_sprint: data.id_sprint,
    }
    console.log('📤 API Update payload:', payload)
    await api.patch('/SprintTask/task', payload)
  },

  /** DELETE /api/SprintTask/task/:id */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/SprintTask/task/${id}`)
  },
}