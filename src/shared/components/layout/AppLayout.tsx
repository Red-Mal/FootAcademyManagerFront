import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { MobileNav } from '@/shared/components/layout/MobileNav'
import { Header } from '@/shared/components/layout/Header'
import { useIsMobile } from '@/shared/hooks/useIsMobile'

export function AppLayout() {
  const isMobile = useIsMobile()

  return (
    <div className="flex min-h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className={`flex-1 px-4 pt-6 md:px-6 md:pb-6 ${isMobile ? 'pb-20' : ''}`}>
          <Outlet />
        </main>
        {isMobile && <MobileNav />}
      </div>
    </div>
  )
}
