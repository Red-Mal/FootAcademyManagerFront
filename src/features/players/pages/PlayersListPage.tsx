import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Pagination } from '@/shared/components/Pagination'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { usePlayersList } from '../api/players.queries'
import { usePlayerUrlFilters } from '../hooks/usePlayerUrlFilters'
import { PlayerFilters } from '../components/PlayerFilters'
import { PlayerList } from '../components/PlayerList'

export function PlayersListPage() {
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser()
  const { filters, setFilter, setPage } = usePlayerUrlFilters()
  const { data, isLoading, isError, error, refetch } = usePlayersList(filters)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{t('players.title')}</h1>
        {currentUser?.role === 'ADMIN' && (
          <Button asChild>
            <Link to="/players/new">
              <Plus className="h-4 w-4" />
              {t('players.new')}
            </Link>
          </Button>
        )}
      </div>

      <PlayerFilters filters={filters} onFilterChange={setFilter} />

      <PlayerList
        players={data?.content ?? []}
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
