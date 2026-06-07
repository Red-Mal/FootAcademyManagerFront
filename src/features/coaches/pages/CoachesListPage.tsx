import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Pagination } from '@/shared/components/Pagination'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useCoachesList } from '../api/coaches.queries'
import { useCoachUrlFilters } from '../hooks/useCoachUrlFilters'
import { CoachFilters } from '../components/CoachFilters'
import { CoachList } from '../components/CoachList'

export function CoachesListPage() {
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser()
  const { filters, setFilter, setPage } = useCoachUrlFilters()
  const { data, isLoading, isError, error, refetch } = useCoachesList(filters)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{t('coaches.title')}</h1>
        {currentUser?.role === 'ADMIN' && (
          <Button asChild>
            <Link to="/coaches/new">
              <Plus className="h-4 w-4" />
              {t('coaches.new')}
            </Link>
          </Button>
        )}
      </div>

      <CoachFilters filters={filters} onFilterChange={setFilter} />

      <CoachList
        coaches={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
      />

      {data && (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
