import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button, Input, Logo, Card } from '@/components/ui'

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState<string | null>(null)
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await sendPasswordReset(email)
    setLoading(false)
    if (error) { setError(error); return }
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">

        <Logo size="lg" className="mb-10" />

        <Card variant="accent" className="p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Reset password</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your email and we'll send a reset link.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4" role="status" aria-live="polite">
              <p className="text-sm text-foreground">
                A reset link has been sent to <strong>{email}</strong>. Check your inbox.
              </p>
              <p className="text-sm text-muted-foreground">
                Didn't receive it?{' '}
                <button
                  onClick={() => setSent(false)}
                  className="cursor-pointer font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 rounded"
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email" type="email" name="email" placeholder="you@example.com…"
                value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email" inputMode="email" spellCheck={false} required
              />

              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-1 justify-center">
                Send reset link
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>

        <p className="mt-12 text-xs text-muted-foreground/60">© 2026 TrueFit</p>
      </div>
    </div>
  )
}
