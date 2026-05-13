import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { User, Briefcase, FileText, LogOut } from 'lucide-react'
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
      <aside className="flex w-56 flex-col border-r border-border">
        <div className="px-4 py-5">
          <Logo className="h-7 w-auto" aria-label="TrueFit" />
        </div>

        <nav className="flex-1 px-2 py-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border px-4 py-4">
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-2 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
