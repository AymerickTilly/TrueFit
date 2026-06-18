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

    // Password updated — send the user to their profile.
    navigate('/profile', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">

        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">
            Choose a strong password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
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
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full"
          >
            Update password
          </Button>
        </form>

      </div>
    </div>
  )
}
