import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation()

  if (totalPages <= 1) {
    return null
  }

  const isFirst = page === 0
  const isLast = page + 1 >= totalPages

  return (
    <nav
      aria-label={t('common.pagination.label')}
      className="flex items-center justify-center gap-1"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden sm:inline-flex"
        disabled={isFirst}
        aria-label={t('common.pagination.first')}
        onClick={() => onPageChange(0)}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isFirst}
        aria-label={t('common.pagination.previous')}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="px-3 text-sm text-muted-foreground">
        {t('common.pagination.summary', { page: page + 1, totalPages })}
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isLast}
        aria-label={t('common.pagination.next')}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden sm:inline-flex"
        disabled={isLast}
        aria-label={t('common.pagination.last')}
        onClick={() => onPageChange(totalPages - 1)}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
