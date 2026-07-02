import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Project } from "@/types"

interface AuthState {
  token: string | null
  accessKey: string | null
  baseUrl: string
  isAuthenticated: boolean
  setAuth: (token: string, accessKey: string) => void
  setBaseUrl: (url: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      accessKey: null,
      baseUrl: "https://catalyst.raga.ai/api",
      isAuthenticated: false,
      setAuth: (token, accessKey) =>
        set({ token, accessKey, isAuthenticated: true }),
      setBaseUrl: (baseUrl) => set({ baseUrl }),
      logout: () => set({ token: null, accessKey: null, isAuthenticated: false }),
    }),
    { name: "ragaai-auth" }
  )
)

interface AppState {
  selectedProject: Project | null
  sidebarCollapsed: boolean
  theme: "light" | "dark" | "system"
  commandPaletteOpen: boolean
  userProfile: {
    name: string
    email: string
    role: string
    avatarUrl?: string
  }
  emailNotifications: boolean
  
  setSelectedProject: (project: Project | null) => void
  toggleSidebar: () => void
  setTheme: (theme: "light" | "dark" | "system") => void
  setCommandPaletteOpen: (open: boolean) => void
  setUserProfile: (profile: Partial<AppState['userProfile']>) => void
  setEmailNotifications: (enabled: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedProject: null,
      sidebarCollapsed: false,
      theme: "dark",
      commandPaletteOpen: false,
      userProfile: {
        name: "Kartik",
        email: "kartikraikar2005@gmail.com",
        role: "Admin"
      },
      emailNotifications: true,
      
      setSelectedProject: (project) => set({ selectedProject: project }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setUserProfile: (profile) => set((s) => ({ userProfile: { ...s.userProfile, ...profile } })),
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled })
    }),
    { name: "ragaai-app-persistent-state" }
  )
)
