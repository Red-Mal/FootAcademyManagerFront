import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/cn'
import { formatCategory } from '@/shared/lib/format'
import type { Category } from '@/shared/types/domain'

const CATEGORY_GROUP_STYLES: Record<'default' | 'subtle', Record<string, string>> = {
  default: {
    U12: 'border-transparent bg-emerald-200 text-emerald-900 hover:bg-emerald-200',
    U13: 'border-transparent bg-emerald-200 text-emerald-900 hover:bg-emerald-200',
    U14: 'border-transparent bg-blue-200 text-blue-900 hover:bg-blue-200',
    U15: 'border-transparent bg-blue-200 text-blue-900 hover:bg-blue-200',
    U16: 'border-transparent bg-orange-200 text-orange-900 hover:bg-orange-200',
    U17: 'border-transparent bg-orange-200 text-orange-900 hover:bg-orange-200',
  },
  subtle: {
    U12: 'border-transparent bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
    U13: 'border-transparent bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
    U14: 'border-transparent bg-blue-50 text-blue-700 hover:bg-blue-50',
    U15: 'border-transparent bg-blue-50 text-blue-700 hover:bg-blue-50',
    U16: 'border-transparent bg-orange-50 text-orange-700 hover:bg-orange-50',
    U17: 'border-transparent bg-orange-50 text-orange-700 hover:bg-orange-50',
  },
}

interface CategoryBadgeProps {
  category: Category
  variant?: 'default' | 'subtle'
  className?: string
}

export function CategoryBadge({ category, variant = 'default', className }: CategoryBadgeProps) {
  return (
    <Badge className={cn(CATEGORY_GROUP_STYLES[variant][category], className)}>
      {formatCategory(category)}
    </Badge>
  )
}
