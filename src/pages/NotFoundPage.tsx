import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl font-semibold">{t('pages.notFound.title')}</h2>
      <p className="text-muted-foreground">{t('pages.notFound.description')}</p>
      <Button asChild>
        <Link to="/">{t('pages.notFound.backHome')}</Link>
      </Button>
    </div>
  )
}
