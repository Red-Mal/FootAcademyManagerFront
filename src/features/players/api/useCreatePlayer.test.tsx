import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { toast } from 'sonner'
import i18n from '@/shared/i18n'
import { ApiError } from '@/shared/api/error'
import type { PlayerResponse } from '@/shared/types/domain'
import { playersApi } from './players.api'
import { playerKeys } from './players.keys'
import { useCreatePlayer } from './players.mutations'

vi.mock('./players.api', () => ({
  playersApi: { create: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const mockedCreate = vi.mocked(playersApi.create)

const PAYLOAD = {
  firstName: 'Karim',
  lastName: 'Benzema',
  category: 'U12',
  heightCm: null,
  weightKg: null,
}

const CREATED_PLAYER: PlayerResponse = {
  id: 'p1',
  firstName: 'Karim',
  lastName: 'Benzema',
  category: 'U12',
  heightCm: null,
  weightKg: null,
  photoUrl: null,
  teamId: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

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

describe('useCreatePlayer', () => {
  it('invalidates the players list query and shows a success toast on success', async () => {
    mockedCreate.mockResolvedValueOnce(CREATED_PLAYER)
    const { Wrapper, invalidateSpy } = createWrapper()
    const { result } = renderHook(() => useCreatePlayer(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.mutateAsync(PAYLOAD)
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: playerKeys.lists() })
    expect(toast.success).toHaveBeenCalledWith('Joueur Karim Benzema créé.')
  })

  it('shows the i18n error message when the backend returns a 400 VALIDATION_FAILED', async () => {
    mockedCreate.mockRejectedValueOnce(
      new ApiError('Validation failed', { status: 400, code: 'VALIDATION_FAILED' }),
    )
    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useCreatePlayer(), { wrapper: Wrapper })

    await act(async () => {
      await expect(result.current.mutateAsync(PAYLOAD)).rejects.toThrow()
    })

    expect(toast.error).toHaveBeenCalledWith('Données invalides.', expect.anything())
  })
})
