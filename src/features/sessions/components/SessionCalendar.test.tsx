import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/utils'
import { useAuthStore } from '@/features/auth/auth.store'
import type { Category, SessionResponse, TeamResponse } from '@/shared/types/domain'
import { mapSessionToCalendarEvent } from '../lib/calendar-events'
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
  it('renders the Schedule-X calendar wrapper without throwing', () => {
    const team = buildTeam({ id: 't1', name: 'U13 A', category: 'U13' })
    const sessions = [
      buildSession({ id: 's1', teamId: 't1' }),
      buildSession({
        id: 's2',
        teamId: 't1',
        startDateTime: '2026-01-02T10:00:00Z',
        endDateTime: '2026-01-02T11:30:00Z',
        location: 'Terrain 2',
      }),
    ]
    const teamById = new Map([[team.id, team]])

    const { container } = renderWithProviders(
      <SessionCalendar sessions={sessions} teamById={teamById} onRangeChange={vi.fn()} />,
    )

    expect(container.querySelector('.sx-react-calendar-wrapper')).toBeInTheDocument()
  })
})

describe('mapSessionToCalendarEvent', () => {
  it('combines the team name and location into the event title', () => {
    const team = buildTeam({ name: 'U13 A', category: 'U13' })
    const session = buildSession({ location: 'Terrain 1' })

    const event = mapSessionToCalendarEvent(session, team)

    expect(event.title).toBe('U13 A · Terrain 1')
  })

  it('falls back to the location only when the team is unknown', () => {
    const session = buildSession({ location: 'Terrain 1' })

    const event = mapSessionToCalendarEvent(session, undefined)

    expect(event.title).toBe('Terrain 1')
    expect(event.calendarId).toBe('default')
  })

  it.each<[Category, string]>([
    ['U12', 'U12'],
    ['U13', 'U13'],
    ['U14', 'U14'],
    ['U15', 'U15'],
    ['U16', 'U16'],
    ['U17', 'U17'],
  ])('maps a team in category %s to the %s calendar', (category, expectedCalendarId) => {
    const team = buildTeam({ category })
    const session = buildSession({})

    const event = mapSessionToCalendarEvent(session, team)

    expect(event.calendarId).toBe(expectedCalendarId)
  })
})
