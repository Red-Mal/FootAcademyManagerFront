import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Pagination } from '@/shared/components/Pagination'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { useTeamsList } from '../api/teams.queries'
import { useTeamUrlFilters } from '../hooks/useTeamUrlFilters'
import { TeamFilters } from '../components/TeamFilters'
import { TeamList } from '../components/TeamList'

export function TeamsListPage() {
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser()
  const { filters, setFilter, setPage } = useTeamUrlFilters()
  const { data, isLoading, isError, error, refetch } = useTeamsList(filters)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{t('teams.title')}</h1>
        {currentUser?.role === 'ADMIN' && (
          <Button asChild>
            <Link to="/teams/new">
              <Plus className="h-4 w-4" />
              {t('teams.new')}
            </Link>
          </Button>
        )}
      </div>

      <TeamFilters filters={filters} onFilterChange={setFilter} />

      <TeamList
        teams={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
      />

      {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  )
}
