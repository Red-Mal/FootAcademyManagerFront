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
  teamUpdateSchema,
  type TeamUpdateInput,
  type TeamUpdateValues,
} from '../schemas/team.schema'

interface TeamUpdateFormProps {
  defaultValues: TeamUpdateValues
  onSubmit: (values: TeamUpdateValues) => Promise<void>
  submitLabel: string
  isPending: boolean
}

export function TeamUpdateForm({ defaultValues, onSubmit, submitLabel, isPending }: TeamUpdateFormProps) {
  const { t } = useTranslation()

  const form = useForm<TeamUpdateInput, unknown, TeamUpdateValues>({
    resolver: zodResolver(teamUpdateSchema),
    defaultValues,
  })

  async function handleSubmit(values: TeamUpdateValues) {
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
          if (field in defaultValues) {
            form.setError(field as keyof TeamUpdateValues, { type: 'server', message })
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

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? t('teams.form.submitting') : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
