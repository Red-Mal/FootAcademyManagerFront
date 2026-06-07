import i18n from '@/shared/i18n'
import { isApiError } from '@/shared/api/error'

const ERROR_CODE_KEYS: Record<string, string> = {
  UNAUTHENTICATED: 'errors.unauthorized',
  BAD_CREDENTIALS: 'errors.unauthorized',
  FORBIDDEN: 'errors.forbidden',
  ENDPOINT_NOT_FOUND: 'errors.notFound',
  VALIDATION_FAILED: 'errors.validation',
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.code && ERROR_CODE_KEYS[error.code]) {
      return i18n.t(ERROR_CODE_KEYS[error.code] as string)
    }

    if (error.status === 401) return i18n.t('errors.unauthorized')
    if (error.status === 403) return i18n.t('errors.forbidden')
    if (error.status === 404) return i18n.t('errors.notFound')
    if (error.status >= 500) return i18n.t('errors.server')
    if (error.status === 0) return i18n.t('errors.network')

    return error.message || i18n.t('errors.generic')
  }

  return i18n.t('errors.generic')
}
