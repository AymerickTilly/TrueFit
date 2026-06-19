import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui'

function Field({
  label, type, name, placeholder, value, onChange, autoComplete, hint,
}: {
  label: string; type: string; name: string; placeholder: string
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string; hint?: string
}) {
  return (
    <div className="group space-y-1.5 border-b border-border pb-3 focus-within:border-foreground transition-colors duration-150">
      <label className="block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        className="block w-full bg-transparent text-base text-foreground placeholder:text-stone-300 focus:outline-none"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

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
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <p className="mb-10 text-xl select-none">
          <span className="font-light text-foreground">True</span>
          <span className="font-semibold text-foreground">Fit</span>
        </p>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Email" type="email" name="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />

          <div className="space-y-1">
            <Field label="Password" type="password" name="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            <div className="text-right pt-1">
              <Link to="/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            Sign in
          </Button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          No account?{' '}
          <Link to="/signup" className="text-foreground font-medium underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>

        <p className="mt-12 text-xs text-stone-300">© 2026 TrueFit</p>
      </div>
    </div>
  )
}
