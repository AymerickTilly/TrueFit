import { useState, useRef, useEffect, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'

  async function handleSignOut() {
    setMenuOpen(false)
    await signOut()
    navigate('/login')
  }

  useEffect(() => {
    if (!menuOpen) return
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [menuOpen])

  const navLink = ({ isActive }: { isActive: boolean }) =>
    [
      'relative flex h-[52px] items-center px-3 text-sm transition-colors duration-150',
      isActive
        ? 'text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-foreground'
        : 'text-muted-foreground hover:text-foreground',
    ].join(' ')

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex h-[52px] shrink-0 items-center gap-6 border-b border-border bg-card px-6">
        <span className="select-none text-[15px] text-foreground shrink-0">
          <span className="font-light">True</span><span className="font-semibold">Fit</span>
        </span>

        <nav aria-label="Main" className="flex h-full items-center gap-0.5">
          <NavLink to="/profile"      className={navLink}>Profile</NavLink>
          <NavLink to="/applications" className={navLink}>Applications</NavLink>
          <NavLink to="/generate"     className={navLink}>Generate</NavLink>
        </nav>

        <div className="flex-1" />

        {/* Avatar → account menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Account menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-foreground transition-colors duration-150 hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {initial}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[188px] rounded-lg border border-border bg-card py-1 shadow-lg"
            >
              <p className="truncate px-3 py-2 text-xs text-muted-foreground">{user?.email}</p>
              <div className="border-t border-border" />
              <NavLink
                to="/account"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                Account settings
              </NavLink>
              <button
                role="menuitem"
                onClick={handleSignOut}
                className="flex w-full cursor-pointer items-center px-3 py-2 text-sm text-red-500 transition-colors hover:bg-muted"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
