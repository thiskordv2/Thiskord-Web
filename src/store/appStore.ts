import { create } from 'zustand'
import type { Project, Channel } from '@/types'

type RightPanel = 'chat' | 'kanban' | 'sprints' | 'members'

interface AppState {
  activeProject: Project | null
  activeChannel: Channel | null
  rightPanel: RightPanel

  setActiveProject: (project: Project | null) => void
  setActiveChannel: (channel: Channel | null) => void
  setRightPanel: (panel: RightPanel) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeProject: null,
  activeChannel: null,
  rightPanel: 'chat',

  setActiveProject: (project) =>
    set({ activeProject: project, activeChannel: null }),

  setActiveChannel: (channel) =>
    set({ activeChannel: channel }),

  setRightPanel: (panel) =>
    set({ rightPanel: panel }),
}))