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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl bg-card px-10 py-10 shadow-xl shadow-blue-100/60 border border-border">

          {/* Header */}
          <div className="mb-8 space-y-1 text-center">
            <span className="text-xl font-bold text-primary tracking-tight">TrueFit</span>
            <h1 className="text-2xl font-semibold text-foreground">Reset your password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 border border-blue-200 px-4 py-3">
                <p className="text-sm text-blue-800">
                  A reset link has been sent to <strong>{email}</strong>. Check your inbox.
                </p>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
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
                Send reset link
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </p>

        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">© 2026 TrueFit</p>

      </div>
    </div>
  )
}
