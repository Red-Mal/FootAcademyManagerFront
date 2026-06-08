import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { differenceInMinutes, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { CategoryBadge } from '@/shared/components/domain/CategoryBadge'
import { formatDateTime, formatTime } from '@/shared/lib/date'
import { formatDurationMinutes } from '@/shared/lib/format'
import type { SessionDetailResponse } from '@/shared/types/domain'

interface SessionDetailCardProps {
  session: SessionDetailResponse
}

export function SessionDetailCard({ session }: SessionDetailCardProps) {
  const { t } = useTranslation()
  const start = parseISO(session.startDateTime)
  const end = parseISO(session.endDateTime)
  const duration = formatDurationMinutes(differenceInMinutes(end, start))

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">
          {formatDateTime(start)} – {formatTime(end)}
        </h1>
        <p className="text-sm text-muted-foreground">{duration}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <section>
          <h2 className="text-sm font-medium text-muted-foreground">{t('sessions.fields.team')}</h2>
          <div className="mt-1 flex items-center gap-2">
            <Link
              to={`/teams/${session.team.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {session.team.name}
            </Link>
            <CategoryBadge category={session.team.category} variant="subtle" />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted-foreground">{t('sessions.fields.location')}</h2>
          <p className="mt-1 text-sm">{session.location}</p>
        </section>

        {session.notes && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground">{t('sessions.fields.notes')}</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm">{session.notes}</p>
          </section>
        )}
      </CardContent>
    </Card>
  )
}
