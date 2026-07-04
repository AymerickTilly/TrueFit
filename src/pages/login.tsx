import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button, Input, Logo, Card } from '@/components/ui'

const TRUST_POINTS = [
  'Grounded in your real experience',
  'Tailored to each job description',
  'One profile, every application',
]

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { setError(error); setLoading(false); return }
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Brand panel ── */}
      <div className="hidden lg:flex lg:w-[400px] xl:w-[460px] shrink-0 flex-col bg-foreground px-12 py-12 bg-dot-grid">
        <Logo size="md" wordmarkClassName="text-background" markClassName="ring-2 ring-background/20 rounded-[9px]" />

        <div className="flex flex-1 flex-col justify-center gap-10">
          <div>
            <h2 className="font-display text-[2rem] font-semibold leading-tight tracking-tight text-background">
              Your story,<br />honestly told.
            </h2>
            <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-background/70">
              Build your profile once. Get a tailored CV for every role — only from what you've actually done.
            </p>
          </div>

          <ul className="space-y-3.5" aria-label="Product highlights">
            {TRUST_POINTS.map(point => (
              <li key={point} className="flex items-center gap-3">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20"
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-sm text-background/80">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-background/40">© 2026 TrueFit</p>
      </div>

      {/* ── Form panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <Logo size="lg" className="mb-10 lg:hidden" />

          <Card variant="accent" className="p-6 sm:p-8">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Sign in to continue to your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email" type="email" name="email" placeholder="you@example.com…"
                value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" inputMode="email" spellCheck={false} required
              />

              <div className="space-y-1">
                <Input
                  label="Password" type="password" name="password" placeholder="Your password…"
                  value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password" required
                />
                <div className="text-right pt-0.5">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">{error}</p>
              )}

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-1 justify-center">
                Sign in
              </Button>
            </form>
          </Card>

          <p className="mt-8 text-sm text-muted-foreground">
            No account?{' '}
            <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
