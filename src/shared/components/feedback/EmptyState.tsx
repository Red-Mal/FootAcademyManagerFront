import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'

interface EmptyStateProps {
  className?: string
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ className, title, description, icon, action }: EmptyStateProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground',
        className,
      )}
    >
      {icon ?? <Inbox className="h-8 w-8" />}
      <p className="text-sm font-medium text-foreground">{title ?? t('common.noData')}</p>
      {description && <p className="text-sm">{description}</p>}
      {action}
    </div>
  )
}
