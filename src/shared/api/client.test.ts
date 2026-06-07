import { afterEach, describe, expect, it } from 'vitest'
import { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { apiClient } from '@/shared/api/client'
import { ApiError, type ProblemDetails } from '@/shared/api/error'
import { useAuthStore } from '@/features/auth/auth.store'

interface InterceptorManagerWithHandlers<T> {
  handlers: Array<{ fulfilled?: T; rejected?: T } | null>
}

const requestHandlers = (
  apiClient.interceptors.request as unknown as InterceptorManagerWithHandlers<
    (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  >
).handlers

const responseHandlers = (
  apiClient.interceptors.response as unknown as InterceptorManagerWithHandlers<
    (error: AxiosError<ProblemDetails>) => Promise<never>
  >
).handlers

const requestInterceptor = requestHandlers[0]!.fulfilled!
const responseErrorInterceptor = responseHandlers[0]!.rejected!

function buildConfig(): InternalAxiosRequestConfig {
  return { headers: new AxiosHeaders() } as InternalAxiosRequestConfig
}

function buildError(
  status: number,
  problem: ProblemDetails,
  url = '/teams',
): AxiosError<ProblemDetails> {
  return {
    isAxiosError: true,
    name: 'AxiosError',
    message: `Request failed with status code ${status}`,
    config: { url, headers: new AxiosHeaders(), _retry: false } as InternalAxiosRequestConfig,
    response: {
      status,
      data: problem,
      statusText: '',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    },
    toJSON: () => ({}),
  } as AxiosError<ProblemDetails>
}

afterEach(() => {
  useAuthStore.getState().clearSession()
})

describe('apiClient request interceptor', () => {
  it('injects the Bearer token when a session is active', () => {
    useAuthStore
      .getState()
      .setSession(
        { accessToken: 'access-token', refreshToken: 'refresh-token' },
        { userId: 'u1', username: 'admin', role: 'ADMIN', profile: null },
      )

    const result = requestInterceptor(buildConfig())

    expect(result.headers.get('Authorization')).toBe('Bearer access-token')
  })

  it('does not set an Authorization header when there is no session', () => {
    const result = requestInterceptor(buildConfig())

    expect(result.headers.get('Authorization')).toBeUndefined()
  })
})

describe('apiClient response interceptor', () => {
  it('maps a ProblemDetails error response to an ApiError', async () => {
    const error = buildError(404, {
      title: 'Not Found',
      detail: 'Ressource introuvable',
      code: 'PLAYER_NOT_FOUND',
      traceId: 'trace-123',
    })

    await expect(responseErrorInterceptor(error)).rejects.toMatchObject({
      status: 404,
      message: 'Ressource introuvable',
      code: 'PLAYER_NOT_FOUND',
      traceId: 'trace-123',
    })
  })

  it('rejects with an instance of ApiError', async () => {
    const error = buildError(500, { title: 'Internal Server Error' })

    await expect(responseErrorInterceptor(error)).rejects.toBeInstanceOf(ApiError)
  })
})
