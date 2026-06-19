import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { User, Briefcase, FileText, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  { to: '/profile',      label: 'Profile',      icon: <User size={15} /> },
  { to: '/applications', label: 'Applications',  icon: <Briefcase size={15} /> },
  { to: '/generate',     label: 'Generate',      icon: <FileText size={15} /> },
]

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className="sticky top-0 h-screen flex w-52 shrink-0 flex-col"
        style={{ backgroundColor: 'var(--sidebar)', color: 'var(--sidebar-fg)' }}
      >
        {/* Wordmark */}
        <div className="px-5 pt-6 pb-5">
          <span className="text-base select-none" style={{ color: 'var(--sidebar-fg)' }}>
            <span className="font-light">True</span><span className="font-semibold">Fit</span>
          </span>
        </div>

        {/* Nav */}
        <nav aria-label="Main" className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                  isActive
                    ? 'font-semibold'
                    : 'font-normal',
                ].join(' ')
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                color: isActive ? 'var(--sidebar-fg)' : 'var(--sidebar-muted)',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget
                if (!el.getAttribute('aria-current')) {
                  el.style.backgroundColor = 'var(--sidebar-hover)'
                  el.style.color = 'var(--sidebar-fg)'
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                if (!el.getAttribute('aria-current')) {
                  el.style.backgroundColor = 'transparent'
                  el.style.color = 'var(--sidebar-muted)'
                }
              }}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="px-4 py-4 space-y-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Account settings */}
          <NavLink
            to="/account"
            className="flex items-center gap-2 text-xs transition-colors duration-150"
            style={{ color: 'var(--sidebar-muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-fg)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-muted)' }}
          >
            <Settings size={12} />
            Account settings
          </NavLink>

          {/* User row */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              style={{ backgroundColor: 'var(--sidebar-active)', color: 'var(--sidebar-fg)' }}
            >
              {initial}
            </div>
            <p
              className="min-w-0 flex-1 truncate text-xs"
              style={{ color: 'var(--sidebar-muted)' }}
            >
              {user?.email}
            </p>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex cursor-pointer items-center gap-2 text-xs transition-colors duration-150"
            style={{ color: 'var(--sidebar-muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-muted)' }}
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
