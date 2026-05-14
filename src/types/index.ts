// ─── Utilisateur ────────────────────────────────────────────────────────────

export interface User {
  user_id: number
  user_name: string
  user_mail: string
  user_picture: string
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginRequest {
  user_auth: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterRequest {
  user_name: string
  user_mail: string
  password: string
  user_picture?: string
}

// ─── Projet ─────────────────────────────────────────────────────────────────

export interface Project {
  project_id: number
  name: string
  description: string
}

export interface CreateProjectRequest {
  name: string
  description: string
}

// ─── Canal ──────────────────────────────────────────────────────────────────

export interface Channel {
  channel_id: number
  name: string
  description: string
  id_project: number
}

export interface CreateChannelRequest {
  name: string
  description: string
  projectId: number
}

// ─── Message (SignalR) ───────────────────────────────────────────────────────

export interface ChatMessage {
  id: number
  user: string
  user_picture?: string // URL photo de profil (optionnel, repli sur initiale)
  text: string
  dateTime: string // format dd/MM HH:mm (déjà converti Europe/Paris côté serveur)
}

// ─── Invitation ──────────────────────────────────────────────────────────────

export interface InviteRequest {
  projectId: number
  expiresAt?: string
}

export interface InviteResponse {
  token: string
  link: string
}

// ─── Sprint ──────────────────────────────────────────────────────────────────

export interface Sprint {
  sprint_id: number
  sprint_goal: string
  sprint_begin_date: string // YYYY-MM-DD
  sprint_end_date: string   // YYYY-MM-DD
  id_project_sprint: number
}

export interface CreateSprintRequest {
  sprint_goal: string
  sprint_begin_date: string
  sprint_end_date: string
  id_project_sprint: number
}

export interface UpdateSprintRequest extends CreateSprintRequest {
  sprint_id: number
}

// ─── Tâche ───────────────────────────────────────────────────────────────────

export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface SprintTask {
  task_id: number
  task_title: string
  task_desc: string
  is_subtask: boolean
  task_status: TaskStatus
  id_creator: number
  id_resp: number
  id_project_task: number
  id_parent_task: number | null
  id_sprint: number
}

export interface CreateTaskRequest {
  task_title: string
  task_desc: string
  is_subtask: boolean
  task_status: TaskStatus
  id_creator: number
  id_resp: number
  id_project_task: number
  id_parent_task: number | null
  id_sprint: number
}

export interface UpdateTaskRequest extends CreateTaskRequest {
  task_id: number
}

// ─── Compte utilisateur ──────────────────────────────────────────────────────

export interface UpdateAccountRequest {
  user_id: number
  user_name: string
  user_mail: string
  user_picture: string
  user_password: string
}