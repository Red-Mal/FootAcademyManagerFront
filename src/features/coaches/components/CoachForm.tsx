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
  coachFormSchema,
  type CoachFormInput,
  type CoachFormValues,
} from '../schemas/coach.schema'

interface CoachFormProps {
  defaultValues?: Partial<CoachFormValues>
  onSubmit: (values: CoachFormValues) => Promise<void>
  submitLabel: string
  isPending: boolean
}

const EMPTY_DEFAULTS: CoachFormValues = {
  firstName: '',
  lastName: '',
  diploma: null,
}

export function CoachForm({ defaultValues, onSubmit, submitLabel, isPending }: CoachFormProps) {
  const { t } = useTranslation()

  const form = useForm<CoachFormInput, unknown, CoachFormValues>({
    resolver: zodResolver(coachFormSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  })

  async function handleSubmit(values: CoachFormValues) {
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
            form.setError(field as keyof CoachFormValues, { type: 'server', message })
          }
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('coaches.fields.firstName')}</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('coaches.fields.lastName')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="diploma"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('coaches.fields.diploma')}</FormLabel>
              <FormControl>
                <Input
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? t('coaches.form.submitting') : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
