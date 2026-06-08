import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { toast } from 'sonner'
import i18n from '@/shared/i18n'
import { ApiError } from '@/shared/api/error'
import { playerKeys } from '@/features/players/api/players.keys'
import { teamsApi } from './teams.api'
import { teamKeys } from './teams.keys'
import { useAddPlayerToTeam } from './teams.mutations'

vi.mock('./teams.api', () => ({
  teamsApi: { addPlayer: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const mockedAddPlayer = vi.mocked(teamsApi.addPlayer)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </I18nextProvider>
    )
  }

  return { Wrapper, invalidateSpy }
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('useAddPlayerToTeam', () => {
  it('invalidates the team detail and player queries and shows a success toast on success', async () => {
    mockedAddPlayer.mockResolvedValueOnce(undefined)
    const { Wrapper, invalidateSpy } = createWrapper()
    const { result } = renderHook(() => useAddPlayerToTeam('t1'), { wrapper: Wrapper })

    await act(async () => {
      await result.current.mutateAsync('p1')
    })

    expect(mockedAddPlayer).toHaveBeenCalledWith('t1', 'p1')
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: teamKeys.detail('t1') })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: playerKeys.lists() })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: playerKeys.detail('p1') })
    expect(toast.success).toHaveBeenCalledWith("Joueur ajouté à l'équipe.")
  })

  it('shows the i18n message for PLAYER_CATEGORY_MISMATCH when the backend rejects the player', async () => {
    mockedAddPlayer.mockRejectedValueOnce(
      new ApiError('Conflict', { status: 409, code: 'PLAYER_CATEGORY_MISMATCH' }),
    )
    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useAddPlayerToTeam('t1'), { wrapper: Wrapper })

    await act(async () => {
      await expect(result.current.mutateAsync('p1')).rejects.toThrow()
    })

    expect(toast.error).toHaveBeenCalledWith(
      "Ce joueur n'appartient pas à la catégorie de l'équipe.",
      expect.anything(),
    )
  })
})
