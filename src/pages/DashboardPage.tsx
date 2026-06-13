import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { addDays } from 'date-fns'
import { useAuthStore } from '@/features/auth/auth.store'
import { DashboardStats } from '@/features/dashboard/components/DashboardStats'
import { UpcomingSessionsCard } from '@/features/dashboard/components/UpcomingSessionsCard'

const UPCOMING_HORIZON_DAYS = 14

export function DashboardPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  const upcomingRange = useMemo(() => {
    const now = new Date()
    return { from: now.toISOString(), to: addDays(now, UPCOMING_HORIZON_DAYS).toISOString() }
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t('pages.dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {t('pages.dashboard.welcome', { name: user?.username ?? '' })}
        </p>
      </div>

      {user && user.role !== 'PLAYER' && (
        <DashboardStats role={user.role} upcomingRange={upcomingRange} />
      )}

      {user && <UpcomingSessionsCard role={user.role} range={upcomingRange} />}
    </div>
  )
}
