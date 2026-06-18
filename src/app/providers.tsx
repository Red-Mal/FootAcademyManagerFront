import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/app/query-client'
import { Toaster } from '@/shared/components/ui/sonner'
import { ErrorBoundary } from '@/shared/components/feedback/ErrorBoundary'
import { ReloadPrompt } from '@/shared/components/feedback/ReloadPrompt'
import '@/shared/i18n'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
        <ReloadPrompt />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
