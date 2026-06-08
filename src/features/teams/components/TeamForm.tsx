import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
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
import { formatCategory, formatFullName } from '@/shared/lib/format'
import { CATEGORIES, type Category } from '@/shared/types/domain'
import { useCoachesList } from '@/features/coaches/api/coaches.queries'
import {
  teamCreateSchema,
  type TeamCreateInput,
  type TeamCreateValues,
} from '../schemas/team.schema'

interface TeamFormProps {
  onSubmit: (values: TeamCreateValues) => Promise<void>
  submitLabel: string
  isPending: boolean
}

const EMPTY_DEFAULTS: TeamCreateValues = {
  name: '',
  category: 'U12',
  coachId: '',
}

export function TeamForm({ onSubmit, submitLabel, isPending }: TeamFormProps) {
  const { t } = useTranslation()
  const { data: coachesPage } = useCoachesList({ size: 100 })
  const coaches = coachesPage?.content ?? []

  const form = useForm<TeamCreateInput, unknown, TeamCreateValues>({
    resolver: zodResolver(teamCreateSchema),
    defaultValues: EMPTY_DEFAULTS,
  })

  const category = form.watch('category')
  const eligibleCoaches = coaches.filter((coach) => coach.categories.includes(category as Category))

  function handleCategoryChange(value: string) {
    form.setValue('category', value)
    const currentCoachId = form.getValues('coachId')
    const stillEligible = coaches.some(
      (coach) => coach.id === currentCoachId && coach.categories.includes(value as Category),
    )
    if (currentCoachId && !stillEligible) {
      form.setValue('coachId', '')
    }
  }

  async function handleSubmit(values: TeamCreateValues) {
    try {
      await onSubmit(values)
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'fieldErrors' in error &&
        error.fieldErrors &&
        typeof error.fieldErrors === 'object'
      ) {
        for (const [field, message] of Object.entries(error.fieldErrors as Record<string, string>)) {
          if (field in EMPTY_DEFAULTS) {
            form.setError(field as keyof TeamCreateValues, { type: 'server', message })
          }
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('teams.fields.name')}</FormLabel>
              <FormControl>
                <Input autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('teams.fields.category')}</FormLabel>
              <Select value={field.value} onValueChange={handleCategoryChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {formatCategory(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coachId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('teams.fields.coach')}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('teams.form.selectCoach')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eligibleCoaches.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      {t('teams.form.noEligibleCoach')}
                    </div>
                  ) : (
                    eligibleCoaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {formatFullName(coach.firstName, coach.lastName)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? t('teams.form.submitting') : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
