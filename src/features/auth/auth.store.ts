// ATTENTION : ce store persiste le JWT dans localStorage, ce qui est exposé au XSS.
// Pour un MVP c'est acceptable. En phase 2, on pourra migrer vers des cookies
// HttpOnly + un endpoint de refresh basé sur cookie pour supprimer ce risque.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MeResponse } from '@/shared/types/domain'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  tokens: AuthTokens | null
  user: MeResponse | null
  setSession: (tokens: AuthTokens, user: MeResponse) => void
  setTokens: (tokens: AuthTokens) => void
  setUser: (user: MeResponse) => void
  clearSession: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      tokens: null,
      user: null,
      setSession: (tokens, user) => set({ tokens, user }),
      setTokens: (tokens) => set({ tokens }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ tokens: null, user: null }),
      isAuthenticated: () => get().tokens !== null,
    }),
    {
      name: 'academy-auth',
      partialize: (state) => ({ tokens: state.tokens, user: state.user }),
    },
  ),
)

export function getAccessToken(): string | null {
  return useAuthStore.getState().tokens?.accessToken ?? null
}

export function getRefreshToken(): string | null {
  return useAuthStore.getState().tokens?.refreshToken ?? null
}
