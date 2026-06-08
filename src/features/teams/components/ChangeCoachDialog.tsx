import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { formatFullName } from '@/shared/lib/format'
import type { Category } from '@/shared/types/domain'
import { useCoachesList } from '@/features/coaches/api/coaches.queries'
import { useChangeCoach } from '../api/teams.mutations'
import {
  changeCoachSchema,
  type ChangeCoachInput,
  type ChangeCoachValues,
} from '../schemas/team.schema'

interface ChangeCoachDialogProps {
  teamId: string
  category: Category
  currentCoachId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangeCoachDialog({
  teamId,
  category,
  currentCoachId,
  open,
  onOpenChange,
}: ChangeCoachDialogProps) {
  const { t } = useTranslation()
  const { data: coachesPage } = useCoachesList({ size: 100 })
  const changeCoach = useChangeCoach(teamId)

  const eligibleCoaches = (coachesPage?.content ?? []).filter((coach) =>
    coach.categories.includes(category),
  )

  const form = useForm<ChangeCoachInput, unknown, ChangeCoachValues>({
    resolver: zodResolver(changeCoachSchema),
    values: { newCoachId: currentCoachId },
  })

  async function handleSubmit(values: ChangeCoachValues) {
    await changeCoach.mutateAsync(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('teams.changeCoach')}</DialogTitle>
          <DialogDescription>{t('teams.changeCoachDescription')}</DialogDescription>
        </DialogHeader>

        {eligibleCoaches.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('teams.noEligibleCoach')}</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newCoachId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('teams.fields.coach')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eligibleCoaches.map((coach) => (
                          <SelectItem key={coach.id} value={coach.id}>
                            {formatFullName(coach.firstName, coach.lastName)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={changeCoach.isPending}>
                  {changeCoach.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
