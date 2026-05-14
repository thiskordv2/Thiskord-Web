import { create } from 'zustand'
import type { Project, Channel } from '@/types'

type RightPanel = 'chat' | 'kanban' | 'sprints' | 'members'
type MobileView = 'chat' | 'right-panel'

interface AppState {
  activeProject: Project | null
  activeChannel: Channel | null
  rightPanel: RightPanel

  // État mobile
  mobileSidebarOpen: boolean
  mobileActiveView: MobileView

  setActiveProject: (project: Project | null) => void
  setActiveChannel: (channel: Channel | null) => void
  setRightPanel: (panel: RightPanel) => void

  // Actions mobile
  toggleMobileSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setMobileActiveView: (view: MobileView) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeProject: null,
  activeChannel: null,
  rightPanel: 'chat',

  mobileSidebarOpen: false,
  mobileActiveView: 'chat',

  setActiveProject: (project) =>
    set({ activeProject: project, activeChannel: null, mobileSidebarOpen: false }),

  setActiveChannel: (channel) =>
    set({ activeChannel: channel, mobileSidebarOpen: false, mobileActiveView: 'chat' }),

  setRightPanel: (panel) =>
    set({ rightPanel: panel }),

  toggleMobileSidebar: () =>
    set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

  setMobileSidebarOpen: (open) =>
    set({ mobileSidebarOpen: open }),

  setMobileActiveView: (view) =>
    set({ mobileActiveView: view }),
}))