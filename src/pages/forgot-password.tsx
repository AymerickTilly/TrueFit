import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button, Input } from '@/components/ui'

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await sendPasswordReset(email)

    setLoading(false)

    if (error) {
      setError(error)
      return
    }

    setSent(true)
  }

  return (
    <div
      className="auth-bg flex min-h-screen items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-sm">

        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary shadow-md shadow-blue-300/40">
            <span className="text-lg font-bold tracking-tight text-white">T</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reset your password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your email and we'll send you a link.
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border border-white/80 bg-white px-8 py-8"
          style={{ boxShadow: '0 8px 40px rgba(37,99,235,0.10), 0 1px 4px rgba(0,0,0,0.04)' }}
        >
          {sent ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
                <p className="text-sm text-blue-800">
                  A reset link has been sent to <strong>{email}</strong>. Check your inbox.
                </p>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive it?{' '}
                <button
                  onClick={() => setSent(false)}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Send reset link
              </Button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-muted-foreground/60">© 2026 TrueFit</p>
      </div>
    </div>
  )
}
