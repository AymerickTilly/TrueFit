import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { User, Briefcase, FileText, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import Logo from '@/assets/logo.svg?react'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  { to: '/profile',      label: 'Profile',      icon: <User size={16} /> },
  { to: '/applications', label: 'Applications',  icon: <Briefcase size={16} /> },
  { to: '/generate',     label: 'Generate',      icon: <FileText size={16} /> },
]

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar — sticky so sign out stays visible on long pages */}
      <aside className="sticky top-0 h-screen flex w-56 flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="flex items-center px-5 py-5 border-b border-border">
          <Logo className="h-7 w-auto" aria-label="TrueFit" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
                ].join(' ')
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border px-4 py-4 space-y-2">
          <p className="truncate text-xs font-medium text-foreground">{user?.email}</p>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              [
                'flex items-center gap-2 text-xs transition-colors duration-150',
                isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')
            }
          >
            <Settings size={13} />
            Account settings
          </NavLink>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs text-muted-foreground transition-colors duration-150 hover:text-red-500"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
