import { toast } from 'sonner'
import { isApiError } from '@/shared/api/error'

type Translate = (key: string, vars?: Record<string, unknown>) => string

// Stratégie à 3 niveaux :
// 1. Code d'erreur métier connu (ex: COACH_HAS_TEAMS) → message i18n du namespace apiErrors
// 2. Sinon → `detail` renvoyé par le backend (déjà en français, filet de sécurité)
// 3. Sinon (ex: erreur réseau) → message générique de la feature (fallbackKey)
export function handleMutationError(err: unknown, t: Translate, fallbackKey: string): void {
  if (isApiError(err)) {
    const codeKey = `apiErrors.${err.code}`
    const message = t(codeKey, { defaultValue: err.problem?.detail || t(fallbackKey) })

    toast.error(message, {
      description: err.traceId ? t('errors.traceIdRef', { traceId: err.traceId }) : undefined,
    })
    return
  }

  toast.error(t(fallbackKey))
}
