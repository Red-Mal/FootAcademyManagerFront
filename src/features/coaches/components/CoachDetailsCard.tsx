import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { CategoryBadge } from '@/shared/components/domain/CategoryBadge'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { formatDateTime } from '@/shared/lib/date'
import { formatFullName } from '@/shared/lib/format'
import type { CoachResponse } from '@/shared/types/domain'

interface CoachDetailsCardProps {
  coach: CoachResponse
  photoSlot?: ReactNode
}

export function CoachDetailsCard({ coach, photoSlot }: CoachDetailsCardProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="items-center text-center">
        {photoSlot ?? (
          <PersonAvatar
            firstName={coach.firstName}
            lastName={coach.lastName}
            photoUrl={coach.photoUrl}
            size="lg"
          />
        )}
        <h1 className="text-xl font-semibold">{formatFullName(coach.firstName, coach.lastName)}</h1>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {coach.categories.map((category) => (
            <CategoryBadge key={category} category={category} />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="text-sm font-medium text-muted-foreground">{t('coaches.detail.diploma')}</h2>
          <p className="text-sm">{coach.diploma ?? t('coaches.detail.notProvided')}</p>
        </section>

        <section className="text-xs text-muted-foreground">
          <p>{t('coaches.detail.createdAt', { date: formatDateTime(coach.createdAt) })}</p>
          <p>{t('coaches.detail.updatedAt', { date: formatDateTime(coach.updatedAt) })}</p>
        </section>
      </CardContent>
    </Card>
  )
}
