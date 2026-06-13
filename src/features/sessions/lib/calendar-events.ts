import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns'
import type { CalendarEvent, CalendarType } from '@schedule-x/calendar'
import type { Category, SessionResponse, TeamResponse } from '@/shared/types/domain'
import { toScheduleXString } from './calendar-dates'

export interface SessionCalendarRange {
  start: Date
  end: Date
}

export const DEFAULT_CALENDAR_ID = 'default'

// Couleurs alignées sur CategoryBadge : Benjamins (U12/U13) vert, Minimes (U14/U15) bleu,
// Cadets (U16/U17) orange.
export const CALENDARS: Record<string, CalendarType> = {
  U12: {
    colorName: 'U12',
    lightColors: { main: '#059669', container: '#a7f3d0', onContainer: '#064e3b' },
    darkColors: { main: '#34d399', container: '#064e3b', onContainer: '#a7f3d0' },
  },
  U13: {
    colorName: 'U13',
    lightColors: { main: '#059669', container: '#a7f3d0', onContainer: '#064e3b' },
    darkColors: { main: '#34d399', container: '#064e3b', onContainer: '#a7f3d0' },
  },
  U14: {
    colorName: 'U14',
    lightColors: { main: '#2563eb', container: '#bfdbfe', onContainer: '#1e3a8a' },
    darkColors: { main: '#60a5fa', container: '#1e3a8a', onContainer: '#bfdbfe' },
  },
  U15: {
    colorName: 'U15',
    lightColors: { main: '#2563eb', container: '#bfdbfe', onContainer: '#1e3a8a' },
    darkColors: { main: '#60a5fa', container: '#1e3a8a', onContainer: '#bfdbfe' },
  },
  U16: {
    colorName: 'U16',
    lightColors: { main: '#ea580c', container: '#fed7aa', onContainer: '#7c2d12' },
    darkColors: { main: '#fb923c', container: '#7c2d12', onContainer: '#fed7aa' },
  },
  U17: {
    colorName: 'U17',
    lightColors: { main: '#ea580c', container: '#fed7aa', onContainer: '#7c2d12' },
    darkColors: { main: '#fb923c', container: '#7c2d12', onContainer: '#fed7aa' },
  },
  [DEFAULT_CALENDAR_ID]: {
    colorName: DEFAULT_CALENDAR_ID,
    lightColors: { main: '#6b7280', container: '#e5e7eb', onContainer: '#374151' },
    darkColors: { main: '#9ca3af', container: '#374151', onContainer: '#e5e7eb' },
  },
}

export function getCalendarId(category?: Category): string {
  return category ?? DEFAULT_CALENDAR_ID
}

export function mapSessionToCalendarEvent(session: SessionResponse, team: TeamResponse | undefined): CalendarEvent {
  return {
    id: session.id,
    title: team ? `${team.name} · ${session.location}` : session.location,
    start: toScheduleXString(session.startDateTime),
    end: toScheduleXString(session.endDateTime),
    calendarId: getCalendarId(team?.category),
  }
}

// Schedule-X n'appelle onRangeUpdate qu'à partir de la première navigation, pas au montage :
// on calcule donc le range initial nous-mêmes, avec la même logique que la vue par défaut.
export function computeInitialRange(view: 'week' | 'month', date: Date): SessionCalendarRange {
  if (view === 'month') {
    return { start: startOfMonth(date), end: endOfMonth(date) }
  }
  return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) }
}
