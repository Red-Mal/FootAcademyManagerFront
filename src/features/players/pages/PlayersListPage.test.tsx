import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { useAuthStore } from '@/features/auth/auth.store'
import { apiClient } from '@/shared/api/client'
import type { PageResponse, PlayerResponse, Role } from '@/shared/types/domain'
import { PlayersListPage } from './PlayersListPage'

vi.mock('@/shared/api/client', () => ({
  apiClient: { get: vi.fn() },
}))

const mockedGet = vi.mocked(apiClient.get)

const EMPTY_TEAMS_PAGE: PageResponse<unknown> = {
  content: [],
  page: 0,
  size: 100,
  totalElements: 0,
  totalPages: 0,
}

function buildPlayer(overrides: Partial<PlayerResponse>): PlayerResponse {
  return {
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
    ...overrides,
  }
}

function playersPage(content: PlayerResponse[]): PageResponse<PlayerResponse> {
  return { content, page: 0, size: 20, totalElements: content.length, totalPages: 1 }
}

function mockApi(role: Role, players: PlayerResponse[]) {
  mockedGet.mockImplementation((url: unknown) => {
    if (url === '/teams') {
      return Promise.resolve({ data: EMPTY_TEAMS_PAGE })
    }
    if (url === '/auth/me') {
      return Promise.resolve({
        data: { userId: 'u1', username: role.toLowerCase(), role, profile: null },
      })
    }
    return Promise.resolve({ data: playersPage(players) })
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

describe('PlayersListPage', () => {
  it('displays the players returned by the API', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [
      buildPlayer({ id: 'p1', firstName: 'Karim', lastName: 'Benzema' }),
      buildPlayer({ id: 'p2', firstName: 'Yassine', lastName: 'Bounou' }),
      buildPlayer({ id: 'p3', firstName: 'Achraf', lastName: 'Hakimi' }),
    ])

    renderWithProviders(<PlayersListPage />, { route: '/players' })

    expect(await screen.findByText('Karim Benzema')).toBeInTheDocument()
    expect(screen.getByText('Yassine Bounou')).toBeInTheDocument()
    expect(screen.getByText('Achraf Hakimi')).toBeInTheDocument()
  })

  it('refetches with the search term in the params after the debounce delay', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [buildPlayer({})])
    const user = userEvent.setup()

    renderWithProviders(<PlayersListPage />, { route: '/players' })
    await screen.findByText('Karim Benzema')
    mockedGet.mockClear()

    await user.type(screen.getByLabelText(/rechercher un joueur/i), 'Yassine')

    await waitFor(
      () => {
        expect(mockedGet).toHaveBeenCalledWith(
          '/players',
          expect.objectContaining({ params: expect.objectContaining({ search: 'Yassine' }) }),
        )
      },
      { timeout: 2000 },
    )
  })

  it('refetches with the selected category in the params', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [buildPlayer({})])
    const user = userEvent.setup()

    renderWithProviders(<PlayersListPage />, { route: '/players' })
    await screen.findByText('Karim Benzema')
    mockedGet.mockClear()

    await user.click(screen.getByLabelText(/^catégorie$/i))
    await user.click(await screen.findByRole('option', { name: /u13/i }))

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith(
        '/players',
        expect.objectContaining({ params: expect.objectContaining({ category: 'U13' }) }),
      )
    })
  })

  it('shows the empty state when there are no players', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [])

    renderWithProviders(<PlayersListPage />, { route: '/players' })

    expect(await screen.findByText('Aucun joueur')).toBeInTheDocument()
  })

  it('shows the "Nouveau joueur" button for an admin', async () => {
    loginAs('ADMIN')
    mockApi('ADMIN', [buildPlayer({})])

    renderWithProviders(<PlayersListPage />, { route: '/players' })

    expect(await screen.findByRole('link', { name: /nouveau joueur/i })).toBeInTheDocument()
  })

  it('hides the "Nouveau joueur" button for a coach', async () => {
    loginAs('COACH')
    mockApi('COACH', [buildPlayer({})])

    renderWithProviders(<PlayersListPage />, { route: '/players' })

    await screen.findByText('Karim Benzema')
    expect(screen.queryByRole('link', { name: /nouveau joueur/i })).not.toBeInTheDocument()
  })
})
