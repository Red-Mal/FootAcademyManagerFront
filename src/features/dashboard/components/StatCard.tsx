import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number | undefined
  isLoading: boolean
}

export function StatCard({ icon: Icon, label, value, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-12" />
          ) : (
            <p className="text-2xl font-semibold">{value ?? 0}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
