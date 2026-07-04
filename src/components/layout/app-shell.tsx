import { useState, useRef, useEffect, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Logo } from '@/components/ui'

interface AppShellProps {
  children: ReactNode
}

const NAV_ITEMS = [
  { to: '/profile',      label: 'Profile' },
  { to: '/applications', label: 'Applications' },
  { to: '/generate',     label: 'Generate' },
] as const

export function AppShell({ children }: AppShellProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'

  async function handleSignOut() {
    setMenuOpen(false)
    setMobileOpen(false)
    await signOut()
    navigate('/login')
  }

  // Body scroll lock while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close desktop avatar menu on outside click
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

  // Close menus on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setMenuOpen(false); setMobileOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const desktopNavLink = ({ isActive }: { isActive: boolean }) =>
    [
      'relative flex h-[52px] items-center px-3 text-sm transition-colors duration-150',
      isActive
        ? 'text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-t-full'
        : 'text-muted-foreground hover:text-foreground',
    ].join(' ')

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      {/* ── Mobile full-screen menu ── */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Mobile menu header */}
          <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border px-5">
            <Logo size="sm" />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Nav links */}
          <nav aria-label="Main" className="flex flex-col px-2 pt-2">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    'flex items-center rounded-md px-4 py-3 text-base font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-primary/8 text-primary'
                      : 'text-foreground hover:bg-muted',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Bottom: user + secondary actions */}
          <div className="mt-auto border-t border-border px-2 py-3">
            <p className="truncate px-4 py-2 text-xs text-muted-foreground">{user?.email}</p>
            <NavLink
              to="/account"
              onClick={() => setMobileOpen(false)}
              className="flex items-center rounded-md px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
            >
              Account settings
            </NavLink>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center rounded-md px-4 py-3 text-sm text-destructive transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 flex h-[52px] shrink-0 items-center border-b border-border bg-card px-5 lg:px-6">

        {/* Wordmark */}
        <Logo size="sm" className="shrink-0" />

        {/* Desktop: centered nav */}
        <nav
          aria-label="Main"
          className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-0.5 lg:flex"
        >
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={desktopNavLink}>{label}</NavLink>
          ))}
        </nav>

        {/* Desktop: avatar menu */}
        <div className="ml-auto hidden lg:block relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Account menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors duration-150 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                className="flex w-full cursor-pointer items-center px-3 py-2 text-sm text-destructive transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
        >
          <Menu size={18} aria-hidden="true" />
        </button>
      </header>

      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}
