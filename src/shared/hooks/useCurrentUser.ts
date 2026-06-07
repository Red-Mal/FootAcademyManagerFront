import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { useAuthStore } from '@/features/auth/auth.store'
import type { MeResponse } from '@/shared/types/domain'

async function fetchCurrentUser(): Promise<MeResponse> {
  const { data } = await apiClient.get<MeResponse>('/auth/me')
  return data
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.tokens !== null)
  const setUser = useAuthStore((state) => state.setUser)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const user = await fetchCurrentUser()
      setUser(user)
      return user
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  })
}
