import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button, Input, Logo, Card } from '@/components/ui'

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
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">

        <Logo size="lg" className="mb-10" />

        <Card variant="accent" className="p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">New password</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Choose something strong and memorable.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New password" type="password" name="password" placeholder="At least 8 characters…"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="new-password" hint="At least 8 characters." required
            />
            <Input
              label="Confirm password" type="password" name="confirm-password" placeholder="Repeat your password…"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password" required
            />

            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-1 justify-center">
              Update password
            </Button>
          </form>
        </Card>

        <p className="mt-12 text-xs text-muted-foreground/60">© 2026 TrueFit</p>
      </div>
    </div>
  )
}
