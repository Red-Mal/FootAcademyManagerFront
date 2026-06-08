import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type SlotInfo,
  type View,
} from 'react-big-calendar'
import {
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import type { Category, SessionResponse, TeamResponse } from '@/shared/types/domain'

const locales = { fr }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: fr }),
  getDay,
  locales,
})

const CALENDAR_VIEWS: View[] = [Views.MONTH, Views.WEEK]
const MIN_TIME = new Date(1970, 0, 1, 7, 0, 0)
const MAX_TIME = new Date(1970, 0, 1, 22, 0, 0)

const CATEGORY_EVENT_COLORS: Record<Category, { backgroundColor: string; color: string }> = {
  U12: { backgroundColor: '#a7f3d0', color: '#065f46' },
  U13: { backgroundColor: '#a7f3d0', color: '#065f46' },
  U14: { backgroundColor: '#bfdbfe', color: '#1e3a8a' },
  U15: { backgroundColor: '#bfdbfe', color: '#1e3a8a' },
  U16: { backgroundColor: '#fed7aa', color: '#7c2d12' },
  U17: { backgroundColor: '#fed7aa', color: '#7c2d12' },
}

export interface SessionCalendarRange {
  start: Date
  end: Date
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  session: SessionResponse
  category?: Category
}

interface SessionCalendarProps {
  sessions: SessionResponse[]
  teamById: Map<string, TeamResponse>
  onRangeChange: (range: SessionCalendarRange) => void
  allowCreate?: boolean
}

function computeRange(date: Date, view: View): SessionCalendarRange {
  if (view === Views.WEEK) {
    return { start: startOfWeek(date, { locale: fr }), end: endOfWeek(date, { locale: fr }) }
  }
  return { start: startOfMonth(date), end: endOfMonth(date) }
}

export function SessionCalendar({ sessions, teamById, onRangeChange, allowCreate }: SessionCalendarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: currentUser } = useCurrentUser()
  const [date, setDate] = useState(() => new Date())
  const [view, setView] = useState<View>(Views.MONTH)

  const canCreate = allowCreate ?? currentUser?.role === 'ADMIN'

  const events = useMemo<CalendarEvent[]>(
    () =>
      sessions.map((session) => {
        const team = teamById.get(session.teamId)
        return {
          id: session.id,
          title: team ? `${team.name} · ${session.location}` : session.location,
          start: parseISO(session.startDateTime),
          end: parseISO(session.endDateTime),
          session,
          category: team?.category,
        }
      }),
    [sessions, teamById],
  )

  const visibleRange = useMemo(() => computeRange(date, view), [date, view])

  useEffect(() => {
    onRangeChange(visibleRange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRange.start.getTime(), visibleRange.end.getTime()])

  const handleRangeChange = useCallback(
    (range: Date[] | { start: Date; end: Date }) => {
      if (Array.isArray(range)) {
        const [start] = range
        const end = range.at(-1)
        if (!start || !end) return
        onRangeChange({ start, end })
      } else {
        onRangeChange(range)
      }
    },
    [onRangeChange],
  )

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      navigate(`/sessions/${event.session.id}`)
    },
    [navigate],
  )

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      if (!canCreate) return
      navigate(`/sessions/new?start=${encodeURIComponent(slotInfo.start.toISOString())}`)
    },
    [canCreate, navigate],
  )

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    const colors = event.category ? CATEGORY_EVENT_COLORS[event.category] : undefined
    return colors ? { style: { backgroundColor: colors.backgroundColor, color: colors.color, border: 'none' } } : {}
  }, [])

  const messages = useMemo(
    () => ({
      date: t('sessions.calendar.date'),
      time: t('sessions.calendar.time'),
      event: t('sessions.calendar.event'),
      allDay: t('sessions.calendar.allDay'),
      week: t('sessions.calendar.week'),
      day: t('sessions.calendar.day'),
      month: t('sessions.calendar.month'),
      previous: t('sessions.calendar.previous'),
      next: t('sessions.calendar.next'),
      today: t('sessions.calendar.today'),
      agenda: t('sessions.calendar.agenda'),
      noEventsInRange: t('sessions.calendar.noEvents'),
      showMore: (total: number) => t('sessions.calendar.showMore', { count: total }),
    }),
    [t],
  )

  return (
    <div className="rounded-lg border bg-card p-2">
      <Calendar
        localizer={localizer}
        culture="fr"
        events={events}
        date={date}
        view={view}
        views={CALENDAR_VIEWS}
        onNavigate={setDate}
        onView={setView}
        onRangeChange={handleRangeChange}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={canCreate ? handleSelectSlot : undefined}
        selectable={canCreate}
        step={15}
        timeslots={4}
        min={MIN_TIME}
        max={MAX_TIME}
        eventPropGetter={eventPropGetter}
        messages={messages}
        style={{ height: 700 }}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
      />
    </div>
  )
}
