import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { MobileNav } from '@/shared/components/layout/MobileNav'
import { Header } from '@/shared/components/layout/Header'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import crnLogo from '@/assets/crn-logo.jpg'

export function AppLayout() {
  const isMobile = useIsMobile()

  return (
    <div className="flex min-h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="relative flex min-h-screen flex-1 flex-col">
        <Header />
        <img
          src={crnLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-1/2 h-[70vmin] w-[70vmin] max-w-full -translate-x-1/2 -translate-y-1/2 object-contain opacity-5"
        />
        <main className={`relative flex-1 px-4 pt-6 md:px-6 md:pb-6 ${isMobile ? 'pb-20' : ''}`}>
          <Outlet />
        </main>
        {isMobile && <MobileNav />}
      </div>
    </div>
  )
}
