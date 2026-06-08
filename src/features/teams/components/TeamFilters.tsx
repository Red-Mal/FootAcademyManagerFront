import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { formatCategory, formatFullName } from '@/shared/lib/format'
import { CATEGORIES } from '@/shared/types/domain'
import { useCoachesList } from '@/features/coaches/api/coaches.queries'
import type { TeamListFilters } from '../api/teams.api'

const ALL_VALUE = 'all'

interface TeamFiltersProps {
  filters: TeamListFilters
  onFilterChange: (key: string, value: string | undefined) => void
}

export function TeamFilters({ filters, onFilterChange }: TeamFiltersProps) {
  const { t } = useTranslation()
  const { data: coachesPage } = useCoachesList({ size: 100 })
  const coaches = coachesPage?.content ?? []

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
          placeholder={t('teams.filters.search')}
          className="pl-9"
          aria-label={t('teams.filters.search')}
        />
      </div>

      <Select
        value={filters.category ?? ALL_VALUE}
        onValueChange={(value) => onFilterChange('category', value === ALL_VALUE ? undefined : value)}
      >
        <SelectTrigger className="sm:w-48" aria-label={t('teams.fields.category')}>
          <SelectValue placeholder={t('teams.fields.category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('teams.filters.allCategories')}</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {formatCategory(category)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.coachId ?? ALL_VALUE}
        onValueChange={(value) => onFilterChange('coachId', value === ALL_VALUE ? undefined : value)}
      >
        <SelectTrigger className="sm:w-48" aria-label={t('teams.fields.coach')}>
          <SelectValue placeholder={t('teams.fields.coach')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('teams.filters.allCoaches')}</SelectItem>
          {coaches.map((coach) => (
            <SelectItem key={coach.id} value={coach.id}>
              {formatFullName(coach.firstName, coach.lastName)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
