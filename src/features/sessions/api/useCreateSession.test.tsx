import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { toast } from 'sonner'
import i18n from '@/shared/i18n'
import { ApiError } from '@/shared/api/error'
import type { SessionResponse } from '@/shared/types/domain'
import { sessionsApi } from './sessions.api'
import { sessionKeys } from './sessions.keys'
import { useCreateSession } from './sessions.mutations'

vi.mock('./sessions.api', () => ({
  sessionsApi: { create: vi.fn() },
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const mockedCreate = vi.mocked(sessionsApi.create)

const PAYLOAD = {
  teamId: 't1',
  startDateTime: '2026-07-01T08:00:00.000Z',
  endDateTime: '2026-07-01T09:30:00.000Z',
  location: 'Terrain principal',
  notes: null,
}

const CREATED_SESSION: SessionResponse = {
  id: 's1',
  teamId: 't1',
  startDateTime: '2026-07-01T08:00:00.000Z',
  endDateTime: '2026-07-01T09:30:00.000Z',
  location: 'Terrain principal',
  notes: null,
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

describe('useCreateSession', () => {
  it('invalidates the sessions list and the team schedule, and shows a success toast on success', async () => {
    mockedCreate.mockResolvedValueOnce(CREATED_SESSION)
    const { Wrapper, invalidateSpy } = createWrapper()
    const { result } = renderHook(() => useCreateSession(), { wrapper: Wrapper })

    await act(async () => {
      await result.current.mutateAsync(PAYLOAD)
    })

    expect(mockedCreate).toHaveBeenCalledWith(PAYLOAD)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: sessionKeys.lists() })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [...sessionKeys.all, 'byTeam', 't1'] })
    expect(toast.success).toHaveBeenCalledWith('Séance créée.')
  })

  it('shows the i18n message for a SESSION_OVERLAP conflict and lets the caller catch it', async () => {
    mockedCreate.mockRejectedValueOnce(
      new ApiError('Conflict', {
        status: 409,
        code: 'SESSION_OVERLAP',
        problem: {
          detail:
            'Conflit de planning : une séance existe déjà sur ce créneau pour cette équipe. ID en conflit : 11111111-1111-1111-1111-111111111111',
        },
      }),
    )
    const { Wrapper } = createWrapper()
    const { result } = renderHook(() => useCreateSession(), { wrapper: Wrapper })

    await act(async () => {
      await expect(result.current.mutateAsync(PAYLOAD)).rejects.toThrow()
    })

    expect(toast.error).toHaveBeenCalledWith(
      'Conflit de planning : une séance existe déjà sur ce créneau pour cette équipe.',
      expect.anything(),
    )
  })
})
