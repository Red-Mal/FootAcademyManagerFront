import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/shared/components/ui/button'

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border bg-background px-4 py-3 shadow-lg">
      <span className="text-sm">New version available.</span>
      <Button size="sm" onClick={() => updateServiceWorker(true)}>
        Reload
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setNeedRefresh(false)}>
        Dismiss
      </Button>
    </div>
  )
}
