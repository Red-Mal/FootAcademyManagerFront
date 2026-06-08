import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { useAuthStore } from '@/features/auth/auth.store'
import { apiClient } from '@/shared/api/client'
import type { CoachResponse, PageResponse, Role, TeamResponse } from '@/shared/types/domain'
import { TeamsListPage } from './TeamsListPage'

vi.mock('@/shared/api/client', () => ({
  apiClient: { get: vi.fn() },
}))

const mockedGet = vi.mocked(apiClient.get)

function buildTeam(overrides: Partial<TeamResponse>): TeamResponse {
  return {
    id: 't1',
    name: 'U12 A',
    category: 'U12',
    coachId: 'c1',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function buildCoach(overrides: Partial<CoachResponse>): CoachResponse {
  return {
    id: 'c1',
    firstName: 'Zinedine',
    lastName: 'Zidane',
    diploma: null,
    photoUrl: null,
    categories: ['U12'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function pageOf<T>(content: T[]): PageResponse<T> {
  return { content, page: 0, size: 20, totalElements: content.length, totalPages: 1 }
}

function mockApi(role: Role, teams: TeamResponse[]) {
  mockedGet.mockImplementation((url: unknown) => {
    if (url === '/coaches') {
      return Promise.resolve({ data: pageOf([buildCoach({})]) })
    }
    if (url === '/auth/me') {
      return Promise.resolve({
        data: { userId: 'u1', username: role.toLowerCase(), role, profile: null },
      })
    }
    return Promise.resolve({ data: pageOf(teams) })
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

describe('TeamsListPage', () => {
  it('displays the teams returned by the API', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [
      buildTeam({ id: 't1', name: 'U12 A' }),
      buildTeam({ id: 't2', name: 'U13 B', category: 'U13' }),
    ])

    renderWithProviders(<TeamsListPage />, { route: '/teams' })

    expect(await screen.findByText('U12 A')).toBeInTheDocument()
    expect(screen.getByText('U13 B')).toBeInTheDocument()
  })

  it('initializes the filters from the URL search params', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [buildTeam({})])

    renderWithProviders(<TeamsListPage />, { route: '/teams?category=U13&search=Espoirs' })

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith(
        '/teams',
        expect.objectContaining({
          params: expect.objectContaining({ category: 'U13', search: 'Espoirs' }),
        }),
      )
    })
    expect(screen.getByLabelText(/rechercher une équipe/i)).toHaveValue('Espoirs')
  })

  it('refetches with the selected category in the URL params', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [buildTeam({})])
    const user = userEvent.setup()

    renderWithProviders(<TeamsListPage />, { route: '/teams' })
    await screen.findByText('U12 A')
    mockedGet.mockClear()

    await user.click(screen.getByLabelText(/^catégorie$/i))
    await user.click(await screen.findByRole('option', { name: /u13/i }))

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith(
        '/teams',
        expect.objectContaining({ params: expect.objectContaining({ category: 'U13' }) }),
      )
    })
  })

  it('shows the "Nouvelle équipe" button for an admin', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [buildTeam({})])

    renderWithProviders(<TeamsListPage />, { route: '/teams' })

    expect(await screen.findByRole('link', { name: /nouvelle équipe/i })).toBeInTheDocument()
  })

  it('hides the "Nouvelle équipe" button for a coach', async () => {
    loginAs('COACH')
    mockApi('COACH', [buildTeam({})])

    renderWithProviders(<TeamsListPage />, { route: '/teams' })

    await screen.findByText('U12 A')
    expect(screen.queryByRole('link', { name: /nouvelle équipe/i })).not.toBeInTheDocument()
  })
})
