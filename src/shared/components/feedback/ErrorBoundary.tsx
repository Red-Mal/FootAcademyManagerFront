import { Component, type ErrorInfo, type ReactNode } from 'react'
import { withTranslation, type WithTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  override render() {
    const { error } = this.state
    const { t, children } = this.props

    if (error) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-lg font-semibold">{t('errors.generic')}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={this.handleReset}>{t('common.retry')}</Button>
        </div>
      )
    }

    return children
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryBase)
