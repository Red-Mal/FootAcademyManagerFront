import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { useAuthStore } from '@/features/auth/auth.store'
import { apiClient } from '@/shared/api/client'
import type { PageResponse, Role, SessionResponse, TeamResponse } from '@/shared/types/domain'
import { SessionsListPage } from './SessionsListPage'

vi.mock('@/shared/api/client', () => ({
  apiClient: { get: vi.fn() },
}))

const mockedGet = vi.mocked(apiClient.get)

function buildTeam(overrides: Partial<TeamResponse>): TeamResponse {
  return {
    id: 't1',
    name: 'U13 A',
    category: 'U13',
    coachId: 'c1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function buildSession(overrides: Partial<SessionResponse>): SessionResponse {
  return {
    id: 's1',
    teamId: 't1',
    startDateTime: '2026-07-01T08:00:00Z',
    endDateTime: '2026-07-01T09:30:00Z',
    location: 'Terrain principal',
    notes: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function pageOf<T>(content: T[]): PageResponse<T> {
  return { content, page: 0, size: 20, totalElements: content.length, totalPages: 1 }
}

function mockApi(role: Role, sessions: SessionResponse[] = []) {
  mockedGet.mockImplementation((url: unknown) => {
    if (url === '/auth/me') {
      return Promise.resolve({
        data: { userId: 'u1', username: role.toLowerCase(), role, profile: null },
      })
    }
    if (url === '/teams') {
      return Promise.resolve({ data: pageOf([buildTeam({})]) })
    }
    if (url === '/sessions') {
      return Promise.resolve({ data: pageOf(sessions) })
    }
    return Promise.resolve({ data: pageOf([]) })
  })
}

function loginAs(role: Role) {
  useAuthStore
    .getState()
    .setSession(
      { accessToken: 'access-token', refreshToken: 'refresh-token' },
      { userId: 'u1', username: role.toLowerCase(), role, profile: null },
    )
}

afterEach(() => {
  useAuthStore.getState().clearSession()
  vi.clearAllMocks()
})

describe('SessionsListPage', () => {
  it('shows the list view by default and switches to the calendar view on toggle', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [buildSession({ id: 's1', location: 'Terrain 1' })])
    const user = userEvent.setup()

    renderWithProviders(<SessionsListPage />, { route: '/sessions' })

    expect(await screen.findByText('Terrain 1')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^aujourd'hui$/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^calendrier$/i }))

    expect(await screen.findByRole('button', { name: /^aujourd'hui$/i })).toBeInTheDocument()
  })

  it('renders the calendar view directly when the URL requests it', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [])

    renderWithProviders(<SessionsListPage />, { route: '/sessions?view=calendar' })

    expect(await screen.findByRole('button', { name: /^aujourd'hui$/i })).toBeInTheDocument()
    expect(screen.queryByText('Aucune séance')).not.toBeInTheDocument()
  })

  it('shows the "Nouvelle séance" button for an admin', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [])

    renderWithProviders(<SessionsListPage />, { route: '/sessions' })

    expect(await screen.findByRole('link', { name: /nouvelle séance/i })).toBeInTheDocument()
  })

  it('hides the "Nouvelle séance" button for a player', async () => {
    loginAs('PLAYER')
    mockApi('PLAYER', [])

    renderWithProviders(<SessionsListPage />, { route: '/sessions' })

    await screen.findByText('Aucune séance')
    expect(screen.queryByRole('link', { name: /nouvelle séance/i })).not.toBeInTheDocument()
  })
})
