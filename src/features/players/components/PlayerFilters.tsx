import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { apiClient } from '@/shared/api/client'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { formatCategory } from '@/shared/lib/format'
import { CATEGORIES } from '@/shared/types/domain'
import type { PageResponse, TeamResponse } from '@/shared/types/domain'
import type { PlayerListFilters } from '../api/players.api'

const ALL_VALUE = 'all'

function useTeamOptions() {
  return useQuery({
    queryKey: ['teams', 'options'],
    queryFn: async () => {
      const { data } = await apiClient.get<PageResponse<TeamResponse>>('/teams', {
        params: { size: 100 },
      })
      return data.content
    },
    staleTime: 5 * 60_000,
  })
}

interface PlayerFiltersProps {
  filters: PlayerListFilters
  onFilterChange: (key: string, value: string | undefined) => void
}

export function PlayerFilters({ filters, onFilterChange }: PlayerFiltersProps) {
  const { t } = useTranslation()
  const { data: teams } = useTeamOptions()

  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const [syncedSearch, setSyncedSearch] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  // Resynchronise l'input local quand le filtre change depuis l'extérieur
  // (navigation, bouton "retour"...). Ajustement pendant le rendu plutôt
  // qu'un effet, pour éviter un rendu intermédiaire avec une valeur obsolète.
  if (filters.search !== syncedSearch) {
    setSyncedSearch(filters.search)
    setSearchInput(filters.search ?? '')
  }

  useEffect(() => {
    if (debouncedSearch !== (filters.search ?? '')) {
      onFilterChange('search', debouncedSearch || undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t('players.filters.search')}
          className="pl-9"
          aria-label={t('players.filters.search')}
        />
      </div>

      <Select
        value={filters.category ?? ALL_VALUE}
        onValueChange={(value) => onFilterChange('category', value === ALL_VALUE ? undefined : value)}
      >
        <SelectTrigger className="sm:w-48" aria-label={t('players.filters.category')}>
          <SelectValue placeholder={t('players.filters.category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('players.filters.allCategories')}</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {formatCategory(category)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.teamId ?? ALL_VALUE}
        onValueChange={(value) =>
          onFilterChange('teamId', value === ALL_VALUE ? undefined : value)
        }
      >
        <SelectTrigger className="sm:w-48" aria-label={t('players.filters.team')}>
          <SelectValue placeholder={t('players.filters.team')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('players.filters.allTeams')}</SelectItem>
          {teams?.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
