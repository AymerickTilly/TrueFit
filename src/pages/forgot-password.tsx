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
    <div className="flex min-h-screen bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12">
        <div>
          <span className="text-2xl font-bold text-white tracking-tight">TrueFit</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Locked out?<br />We've got you.
          </h1>
          <p className="text-blue-200 text-lg">
            Enter your email and we'll send you a secure link to reset your password.
          </p>
        </div>
        <p className="text-blue-300 text-sm">© 2026 TrueFit</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground">Reset your password</h2>
            <p className="text-sm text-muted-foreground">
              We'll send a reset link to your email address.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 border border-blue-200 px-4 py-3">
                <p className="text-sm text-blue-800">
                  A reset link has been sent to <strong>{email}</strong>. Check your inbox.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
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

          <p className="text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
