import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { useAuthStore } from '@/features/auth/auth.store'
import type { SessionResponse, TeamResponse } from '@/shared/types/domain'
import { SessionCalendar } from './SessionCalendar'

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
    startDateTime: '2026-01-01T10:00:00Z',
    endDateTime: '2026-01-01T11:30:00Z',
    location: 'Terrain principal',
    notes: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

afterEach(() => {
  useAuthStore.getState().clearSession()
  vi.clearAllMocks()
})

describe('SessionCalendar', () => {
  it('renders an event for each session using its team name and location', () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30, 0)

    const team = buildTeam({ id: 't1', name: 'U13 A', category: 'U13' })
    const session = buildSession({
      id: 's1',
      teamId: 't1',
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
      location: 'Terrain 1',
    })
    const teamById = new Map([[team.id, team]])

    renderWithProviders(
      <SessionCalendar sessions={[session]} teamById={teamById} onRangeChange={vi.fn()} />,
    )

    expect(screen.getByText('U13 A · Terrain 1')).toBeInTheDocument()
  })

  it('reports the visible range when it mounts', () => {
    const onRangeChange = vi.fn()

    renderWithProviders(<SessionCalendar sessions={[]} teamById={new Map()} onRangeChange={onRangeChange} />)

    expect(onRangeChange).toHaveBeenCalledWith(
      expect.objectContaining({ start: expect.any(Date), end: expect.any(Date) }),
    )
  })
})
