import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui'

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
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">

        <p className="mb-10 text-xl select-none">
          <span className="font-light text-foreground">True</span>
          <span className="font-semibold text-foreground">Fit</span>
        </p>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Reset password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we'll send a reset link.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground">
              A reset link has been sent to <strong>{email}</strong>. Check your inbox.
            </p>
            <p className="text-sm text-muted-foreground">
              Didn't receive it?{' '}
              <button onClick={() => setSent(false)} className="cursor-pointer text-foreground font-medium underline-offset-4 hover:underline">
                Try again
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 border-b border-border pb-3 focus-within:border-foreground transition-colors duration-150">
              <label className="block text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="block w-full bg-transparent text-base text-foreground placeholder:text-stone-300 focus:outline-none"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Send reset link
            </Button>
          </form>
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          <Link to="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>

        <p className="mt-12 text-xs text-stone-300">© 2026 TrueFit</p>
      </div>
    </div>
  )
}
