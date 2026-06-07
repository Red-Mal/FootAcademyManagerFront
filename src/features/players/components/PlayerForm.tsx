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
import { formatCategory } from '@/shared/lib/format'
import { CATEGORIES } from '@/shared/types/domain'
import {
  playerFormSchema,
  type PlayerFormInput,
  type PlayerFormValues,
} from '../schemas/player.schema'

interface PlayerFormProps {
  defaultValues?: Partial<PlayerFormValues>
  onSubmit: (values: PlayerFormValues) => Promise<void>
  submitLabel: string
  isPending: boolean
}

const EMPTY_DEFAULTS: PlayerFormValues = {
  firstName: '',
  lastName: '',
  category: 'U12',
  heightCm: null,
  weightKg: null,
}

export function PlayerForm({ defaultValues, onSubmit, submitLabel, isPending }: PlayerFormProps) {
  const { t } = useTranslation()

  const form = useForm<PlayerFormInput, unknown, PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...defaultValues },
  })

  async function handleSubmit(values: PlayerFormValues) {
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
            form.setError(field as keyof PlayerFormValues, { type: 'server', message })
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
                <FormLabel>{t('players.fields.firstName')}</FormLabel>
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
                <FormLabel>{t('players.fields.lastName')}</FormLabel>
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('players.fields.category')}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {formatCategory(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="heightCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('players.fields.heightCm')}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="number"
                      className="pr-10"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {t('players.form.heightSuffix')}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weightKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('players.fields.weightKg')}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      className="pr-10"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {t('players.form.weightSuffix')}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? t('players.form.submitting') : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
