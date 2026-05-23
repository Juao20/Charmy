import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasSeenOnboarding: false,

      setTokens: (access, refresh) => set({
        accessToken: access,
        refreshToken: refresh,
      }),

      setUser: (user) => set({ user }),

      setOnboardingDone: () => set({ hasSeenOnboarding: true }),

      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        hasSeenOnboarding: false,
      }),
    }),
    { name: 'charmy-auth' }
  )
)

export default useAuthStore