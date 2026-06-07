import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'

interface LoadingStateProps {
  className?: string
  label?: string
}

export function LoadingState({ className, label }: LoadingStateProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground',
        className,
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="text-sm">{label ?? t('common.loading')}</span>
    </div>
  )
}
