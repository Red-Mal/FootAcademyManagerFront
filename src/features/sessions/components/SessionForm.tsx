import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
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
import { isApiError } from '@/shared/api/error'
import { useCurrentUser } from '@/shared/hooks/useCurrentUser'
import { formatCategory } from '@/shared/lib/format'
import { useTeamsList } from '@/features/teams/api/teams.queries'
import type { SessionTeamSummary } from '@/shared/types/domain'
import {
  sessionCreateSchema,
  sessionFormSchema,
  type SessionFormInput,
  type SessionFormValues,
} from '../schemas/session.schema'

const CONFLICT_ID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

interface SessionFormProps {
  mode: 'create' | 'edit'
  team?: SessionTeamSummary
  defaultValues: SessionFormValues
  onSubmit: (values: SessionFormValues) => Promise<void>
  submitLabel: string
  isPending: boolean
}

interface OverlapError {
  message: string
  conflictingSessionId?: string
}

function toDateTimeLocalValue(date: Date): string {
  return Number.isNaN(date.getTime()) ? '' : format(date, "yyyy-MM-dd'T'HH:mm")
}

function parseDateTimeLocalValue(value: string): Date {
  return value ? new Date(value) : new Date(NaN)
}

export function SessionForm({
  mode,
  team,
  defaultValues,
  onSubmit,
  submitLabel,
  isPending,
}: SessionFormProps) {
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser()
  const { data: teamsPage } = useTeamsList({ size: 100 })
  const [overlapError, setOverlapError] = useState<OverlapError | null>(null)

  const eligibleTeams = useMemo(() => {
    const allTeams = teamsPage?.content ?? []
    return currentUser?.role === 'COACH'
      ? allTeams.filter((candidate) => candidate.coachId === currentUser.profile?.id)
      : allTeams
  }, [teamsPage, currentUser])

  const schema = mode === 'create' ? sessionCreateSchema : sessionFormSchema
  const form = useForm<SessionFormInput, unknown, SessionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  async function handleSubmit(values: SessionFormValues) {
    setOverlapError(null)
    try {
      await onSubmit(values)
    } catch (error) {
      if (isApiError(error) && error.code === 'SESSION_OVERLAP') {
        const conflictingSessionId = error.problem?.detail?.match(CONFLICT_ID_PATTERN)?.[0]
        setOverlapError({ message: t('apiErrors.SESSION_OVERLAP'), conflictingSessionId })
        return
      }

      if (
        error &&
        typeof error === 'object' &&
        'fieldErrors' in error &&
        error.fieldErrors &&
        typeof error.fieldErrors === 'object'
      ) {
        for (const [field, message] of Object.entries(error.fieldErrors as Record<string, string>)) {
          if (field in defaultValues) {
            form.setError(field as keyof SessionFormValues, { type: 'server', message })
          }
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {mode === 'create' ? (
          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sessions.fields.team')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('sessions.form.selectTeam')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eligibleTeams.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {t('sessions.form.noEligibleTeam')}
                      </div>
                    ) : (
                      eligibleTeams.map((teamOption) => (
                        <SelectItem key={teamOption.id} value={teamOption.id}>
                          {teamOption.name} · {formatCategory(teamOption.category)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          team && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium leading-none">{t('sessions.fields.team')}</p>
              <p className="text-sm text-muted-foreground">
                {team.name} · {formatCategory(team.category)}
              </p>
            </div>
          )
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sessions.fields.startDateTime')}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    step={900}
                    value={toDateTimeLocalValue(field.value)}
                    onChange={(event) => field.onChange(parseDateTimeLocalValue(event.target.value))}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sessions.fields.endDateTime')}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    step={900}
                    value={toDateTimeLocalValue(field.value)}
                    onChange={(event) => field.onChange(parseDateTimeLocalValue(event.target.value))}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('sessions.fields.location')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('sessions.fields.notes')}</FormLabel>
              <FormControl>
                <Textarea
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

        {overlapError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('sessions.errors.overlapTitle')}</AlertTitle>
            <AlertDescription>
              {overlapError.message}
              {overlapError.conflictingSessionId && (
                <>
                  {' '}
                  <Link
                    to={`/sessions/${overlapError.conflictingSessionId}`}
                    className="font-medium underline underline-offset-2"
                  >
                    {t('sessions.errors.viewConflict')}
                  </Link>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? t('sessions.form.submitting') : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
