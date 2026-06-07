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
import { formatCategory } from '@/shared/lib/format'
import { CATEGORIES } from '@/shared/types/domain'
import type { CoachListFilters } from '../api/coaches.api'

const ALL_VALUE = 'all'

interface CoachFiltersProps {
  filters: CoachListFilters
  onFilterChange: (key: string, value: string | undefined) => void
}

export function CoachFilters({ filters, onFilterChange }: CoachFiltersProps) {
  const { t } = useTranslation()

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
          placeholder={t('coaches.filters.search')}
          className="pl-9"
          aria-label={t('coaches.filters.search')}
        />
      </div>

      <Select
        value={filters.category ?? ALL_VALUE}
        onValueChange={(value) => onFilterChange('category', value === ALL_VALUE ? undefined : value)}
      >
        <SelectTrigger className="sm:w-48" aria-label={t('coaches.filters.category')}>
          <SelectValue placeholder={t('coaches.filters.category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t('coaches.filters.allCategories')}</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {formatCategory(category)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
