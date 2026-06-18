import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button, Input } from '@/components/ui'

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)

    if (error) {
      setError(error)
      return
    }

    navigate('/profile', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl bg-card px-10 py-10 shadow-xl shadow-blue-100/60 border border-border">

          {/* Header */}
          <div className="mb-8 space-y-1 text-center">
            <span className="text-xl font-bold text-primary tracking-tight">TrueFit</span>
            <h1 className="text-2xl font-semibold text-foreground">Set a new password</h1>
            <p className="text-sm text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              hint="At least 8 characters."
            />

            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-200">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Update password
            </Button>
          </form>

        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">© 2026 TrueFit</p>

      </div>
    </div>
  )
}
