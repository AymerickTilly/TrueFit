import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui'

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) { setError(error); return }
    navigate('/profile', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">

        <p className="mb-10 text-xl select-none">
          <span className="font-light text-foreground">True</span>
          <span className="font-semibold text-foreground">Fit</span>
        </p>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">New password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose something strong and memorable.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'New password', name: 'password', value: password, set: setPassword, hint: 'At least 8 characters.' },
            { label: 'Confirm password', name: 'confirm-password', value: confirm, set: setConfirm },
          ].map(({ label, name, value, set, hint }) => (
            <div key={name} className="space-y-1.5 border-b border-border pb-3 focus-within:border-foreground transition-colors duration-150">
              <label className="block text-xs font-medium text-muted-foreground">{label}</label>
              <input
                type="password"
                name={name}
                placeholder="••••••••"
                value={value}
                onChange={e => set(e.target.value)}
                autoComplete="new-password"
                required
                className="block w-full bg-transparent text-base text-foreground placeholder:text-stone-300 focus:outline-none"
              />
              {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            Update password
          </Button>
        </form>

        <p className="mt-12 text-xs text-stone-300">© 2026 TrueFit</p>
      </div>
    </div>
  )
}
