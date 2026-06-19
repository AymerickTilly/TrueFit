import { useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button, Input } from '@/components/ui'

function Feedback({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <p
      role={type === 'error' ? 'alert' : 'status'}
      className={type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}
    >
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
    setError(null); setSuccess(null)
    if (newEmail === user?.email) { setError('That is already your current email.'); return }
    const { error: authError } = await signIn(user?.email ?? '', password)
    if (authError) { setError('Incorrect password.'); return }
    setLoading(true)
    const { supabase } = await import('@/lib/api/supabase')
    const { error: updateError } = await supabase.auth.updateUser({ email: newEmail })
    setLoading(false)
    if (updateError) { setError(updateError.message); return }
    setSuccess('Confirmation sent to ' + newEmail + '. Check your inbox.')
    setNewEmail(''); setPassword('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <p className="text-xs text-muted-foreground">
        Current: <span className="font-medium text-foreground">{user?.email}</span>
      </p>
      <Input label="New email address" type="email" name="new-email" placeholder="new@example.com"
        value={newEmail} onChange={e => setNewEmail(e.target.value)} required autoComplete="email" />
      <Input label="Current password" type="password" name="current-password" placeholder="••••••••"
        value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
      {error   && <Feedback type="error"   message={error} />}
      {success && <Feedback type="success" message={success} />}
      <Button type="submit" variant="primary" size="sm" loading={loading}>Update email</Button>
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
    setError(null); setSuccess(null)
    if (next !== confirm) { setError('New passwords do not match.'); return }
    if (next.length < 8)  { setError('Password must be at least 8 characters.'); return }
    const { error: authError } = await signIn(user?.email ?? '', current)
    if (authError) { setError('Current password is incorrect.'); return }
    setLoading(true)
    const { error: updateError } = await updatePassword(next)
    setLoading(false)
    if (updateError) { setError(updateError); return }
    setSuccess('Password updated.')
    setCurrent(''); setNext(''); setConfirm('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <Input label="Current password" type="password" name="current-password" placeholder="••••••••"
        value={current} onChange={e => setCurrent(e.target.value)} required autoComplete="current-password" />
      <Input label="New password" type="password" name="new-password" placeholder="••••••••"
        value={next} onChange={e => setNext(e.target.value)} required autoComplete="new-password" hint="At least 8 characters." />
      <Input label="Confirm new password" type="password" name="confirm-password" placeholder="••••••••"
        value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" />
      {error   && <Feedback type="error"   message={error} />}
      {success && <Feedback type="success" message={success} />}
      <Button type="submit" variant="primary" size="sm" loading={loading}>Update password</Button>
    </form>
  )
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="flex gap-10 border-t border-border py-10">
      <div className="w-44 shrink-0 pt-0.5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </section>
  )
}

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="mb-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your login details.</p>
      </div>

      <Section title="Email address" description="A confirmation will be sent to the new address before the change takes effect.">
        <EmailForm />
      </Section>

      <Section title="Password" description="You will need your current password to confirm the change.">
        <PasswordForm />
      </Section>
    </div>
  )
}
