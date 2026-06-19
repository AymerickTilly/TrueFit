import { useLocation } from 'react-router-dom'
import { type ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className="page-enter flex-1">
      {children}
    </div>
  )
}
