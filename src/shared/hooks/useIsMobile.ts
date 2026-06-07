import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = '(max-width: 767px)'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_BREAKPOINT).matches)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_BREAKPOINT)
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)

    mediaQueryList.addEventListener('change', handleChange)

    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
