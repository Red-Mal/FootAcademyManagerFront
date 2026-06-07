import axios, { AxiosError } from 'axios'
import env from '@/env'
import './types'
import { ApiError, type ProblemDetails } from '@/shared/api/error'
import { useAuthStore } from '@/features/auth/auth.store'
import type { LoginResponse } from '@/shared/types/domain'

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().tokens?.accessToken
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return config
})

function toApiError(error: AxiosError<ProblemDetails>): ApiError {
  const problem = error.response?.data
  const status = error.response?.status ?? 0
  const message = problem?.detail ?? problem?.title ?? error.message

  return new ApiError(message, {
    status,
    code: problem?.code,
    traceId: problem?.traceId,
    fieldErrors: problem?.fieldErrors,
    problem,
  })
}

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().tokens?.refreshToken
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post<LoginResponse>(`${env.API_BASE_URL}/auth/refresh`, {
    refreshToken,
  })

  const { accessToken, refreshToken: newRefreshToken, user } = response.data
  useAuthStore.getState().setSession({ accessToken, refreshToken: newRefreshToken }, user)

  return accessToken
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ProblemDetails>) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith('/auth/refresh') &&
      !originalRequest.url?.endsWith('/auth/login')
    ) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }
        const accessToken = await refreshPromise
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`)
        return apiClient(originalRequest)
      } catch {
        useAuthStore.getState().clearSession()
        return Promise.reject(toApiError(error))
      }
    }

    return Promise.reject(toApiError(error))
  },
)
