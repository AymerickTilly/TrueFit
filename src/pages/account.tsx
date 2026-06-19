import { useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button, Input } from '@/components/ui'

function SuccessBanner({ message }: { message: string }) {
  return (
    <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
      {message}
    </p>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
      {message}
    </p>
  )
}

function EmailForm() {
  const { user, signIn } = useAuth()
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (newEmail === user?.email) {
      setError('That is already your current email address.')
      return
    }

    const { error: authError } = await signIn(user?.email ?? '', password)
    if (authError) { setError('Incorrect password.'); return }

    setLoading(true)
    const { supabase } = await import('@/lib/api/supabase')
    const { error: updateError } = await supabase.auth.updateUser({ email: newEmail })
    setLoading(false)

    if (updateError) { setError(updateError.message); return }

    setSuccess('Confirmation sent to ' + newEmail + '. Check your inbox.')
    setNewEmail('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Current: <span className="font-medium text-foreground">{user?.email}</span>
      </p>
      <Input
        label="New email address"
        type="email"
        name="new-email"
        placeholder="new@example.com"
        value={newEmail}
        onChange={e => setNewEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        label="Confirm with your current password"
        type="password"
        name="current-password"
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      {error   && <ErrorBanner   message={error} />}
      {success && <SuccessBanner message={success} />}
      <Button type="submit" variant="primary" size="sm" loading={loading}>
        Update email
      </Button>
    </form>
  )
}

function PasswordForm() {
  const { updatePassword, signIn, user } = useAuth()
  const [current, setCurrent] = useState('')
  const [next,    setNext]    = useState('')
  const [confirm, setConfirm] = useState('')
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (next !== confirm) { setError('New passwords do not match.'); return }
    if (next.length < 8)  { setError('Password must be at least 8 characters.'); return }

    const { error: authError } = await signIn(user?.email ?? '', current)
    if (authError) { setError('Current password is incorrect.'); return }

    setLoading(true)
    const { error: updateError } = await updatePassword(next)
    setLoading(false)

    if (updateError) { setError(updateError); return }

    setSuccess('Password updated successfully.')
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Current password"
        type="password"
        name="current-password"
        placeholder="••••••••"
        value={current}
        onChange={e => setCurrent(e.target.value)}
        required
        autoComplete="current-password"
      />
      <Input
        label="New password"
        type="password"
        name="new-password"
        placeholder="••••••••"
        value={next}
        onChange={e => setNext(e.target.value)}
        required
        autoComplete="new-password"
        hint="At least 8 characters."
      />
      <Input
        label="Confirm new password"
        type="password"
        name="confirm-password"
        placeholder="••••••••"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        required
        autoComplete="new-password"
      />
      {error   && <ErrorBanner   message={error} />}
      {success && <SuccessBanner message={success} />}
      <Button type="submit" variant="primary" size="sm" loading={loading}>
        Update password
      </Button>
    </form>
  )
}

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Account</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Manage your email and password.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card px-6 py-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Email address</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">A confirmation will be sent to the new address.</p>
        </div>
        <EmailForm />
      </section>

      <section className="rounded-2xl border border-border bg-card px-6 py-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Password</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">You will need to confirm with your current password.</p>
        </div>
        <PasswordForm />
      </section>
    </div>
  )
}
