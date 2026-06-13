import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewMonthGrid, createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import type { SessionResponse, TeamResponse } from '@/shared/types/domain'
import { fromScheduleXString, parseRangeEnd, parseRangeStart } from '../lib/calendar-dates'
import {
  CALENDARS,
  computeInitialRange,
  mapSessionToCalendarEvent,
  type SessionCalendarRange,
} from '../lib/calendar-events'

export type { SessionCalendarRange }

interface SessionCalendarProps {
  sessions: SessionResponse[]
  teamById: Map<string, TeamResponse>
  onRangeChange: (range: SessionCalendarRange) => void
  allowCreate?: boolean
  onSelectSession?: (id: string) => void
  onSelectSlot?: (startISO: string) => void
  defaultView?: 'week' | 'month'
}

// Hauteur de la grille semaine : 60px par heure sur 24h, pour des créneaux lisibles.
// La grille devient alors plus haute que le wrapper visible (600px), qui défile verticalement.
const WEEK_GRID_HOUR_HEIGHT = 60
const WEEK_GRID_HEIGHT = WEEK_GRID_HOUR_HEIGHT * 24
const DEFAULT_SCROLL_HOUR = 7

export function SessionCalendar({
  sessions,
  teamById,
  onRangeChange,
  allowCreate,
  onSelectSession,
  onSelectSlot,
  defaultView = 'week',
}: SessionCalendarProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: currentUser } = useCurrentUser()
  const canCreate = allowCreate ?? currentUser?.role === 'ADMIN'

  // useCalendarApp ne crée le calendrier qu'une seule fois (au montage) : la config et les
  // callbacks passés à useCalendarApp sont donc figés sur leur première valeur. On passe par
  // des refs pour que les callbacks lisent toujours les dernières props.
  const onRangeChangeRef = useRef(onRangeChange)
  const onSelectSessionRef = useRef(onSelectSession)
  const onSelectSlotRef = useRef(onSelectSlot)
  const canCreateRef = useRef(canCreate)
  const navigateRef = useRef(navigate)

  useEffect(() => {
    onRangeChangeRef.current = onRangeChange
    onSelectSessionRef.current = onSelectSession
    onSelectSlotRef.current = onSelectSlot
    canCreateRef.current = canCreate
    navigateRef.current = navigate
  }, [onRangeChange, onSelectSession, onSelectSlot, canCreate, navigate])

  const [eventsService] = useState(() => createEventsServicePlugin())

  const calendar = useCalendarApp(
    {
      views: [createViewWeek(), createViewMonthGrid()],
      defaultView: defaultView === 'month' ? 'month-grid' : 'week',
      locale: 'fr-FR',
      weekOptions: { gridHeight: WEEK_GRID_HEIGHT },
      calendars: CALENDARS,
      callbacks: {
        onRangeUpdate(range) {
          onRangeChangeRef.current({ start: parseRangeStart(range.start), end: parseRangeEnd(range.end) })
        },
        onEventClick(event) {
          const id = String(event.id)
          if (onSelectSessionRef.current) onSelectSessionRef.current(id)
          else navigateRef.current(`/sessions/${id}`)
        },
        onClickDateTime(dateTime) {
          if (!canCreateRef.current) return
          const startISO = fromScheduleXString(dateTime)
          if (onSelectSlotRef.current) onSelectSlotRef.current(startISO)
          else navigateRef.current(`/sessions/new?start=${encodeURIComponent(startISO)}`)
        },
        onClickDate(date) {
          if (!canCreateRef.current) return
          const startISO = fromScheduleXString(date)
          if (onSelectSlotRef.current) onSelectSlotRef.current(startISO)
          else navigateRef.current(`/sessions/new?start=${encodeURIComponent(startISO)}`)
        },
      },
    },
    [eventsService],
  )

  // Émet le range initial une seule fois au montage (cf. computeInitialRange).
  useEffect(() => {
    onRangeChangeRef.current(computeInitialRange(defaultView, new Date()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const events = sessions.map((session) => mapSessionToCalendarEvent(session, teamById.get(session.teamId)))
    eventsService.set(events)
  }, [sessions, teamById, eventsService])

  // Positionne le défilement de la grille semaine sur une heure de la journée plutôt que minuit.
  // Le calendrier rend son contenu après le montage : on attend la frame suivante avant de défiler.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const viewContainer = containerRef.current?.querySelector<HTMLElement>('.sx__view-container')
      if (viewContainer) {
        viewContainer.scrollTop = (DEFAULT_SCROLL_HOUR / 24) * WEEK_GRID_HEIGHT
      }
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="rounded-lg border bg-card p-2" ref={containerRef}>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
