// Miroir du format RFC 7807 renvoyé par GlobalExceptionHandler côté backend
// (ma.academy.shared.exception.ProblemDetails)

export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  code?: string
  traceId?: string
  timestamp?: string
  fieldErrors?: Record<string, string>
  [key: string]: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly traceId?: string
  readonly fieldErrors?: Record<string, string>
  readonly problem?: ProblemDetails

  constructor(
    message: string,
    options: {
      status: number
      code?: string
      traceId?: string
      fieldErrors?: Record<string, string>
      problem?: ProblemDetails
    },
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.traceId = options.traceId
    this.fieldErrors = options.fieldErrors
    this.problem = options.problem
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
