import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, Check, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button, Spinner } from '@/components/ui'
import { getProfileWithSkills } from '@/lib/api/profile'
import { getApplications } from '@/lib/api/applications'
import { generateCV, type GenerateStep } from '@/lib/api/generate'
import type { ProfileWithSkills, JobApplication } from '@/types'

function StepIndicator({ step }: { step: GenerateStep }) {
  const steps: { id: GenerateStep; label: string }[] = [
    { id: 'analyzing', label: 'Analysing job' },
    { id: 'generating', label: 'Writing CV' },
  ]
  return (
    <div className="flex items-center gap-3">
      {steps.map(({ id, label }, i) => {
        const active = step === id
        const done = steps.findIndex(s => s.id === step) > i
        return (
          <div key={id} className="flex items-center gap-2 text-xs">
            <span
              className={[
                'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold',
                done ? 'bg-primary text-white' :
                active ? 'bg-primary text-white motion-safe:animate-pulse' :
                'bg-muted text-muted-foreground',
              ].join(' ')}
            >
              {i + 1}
            </span>
            <span className={active ? 'text-foreground font-medium' : done ? 'text-primary' : 'text-muted-foreground'}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="text-border">—</span>}
          </div>
        )
      })}
    </div>
  )
}

export default function GeneratePage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  const [profile, setProfile]           = useState<ProfileWithSkills | null>(null)
  const [applications, setApplications] = useState<JobApplication[] | null>(null)
  const [selectedId, setSelectedId]     = useState<string>(searchParams.get('id') ?? '')

  const [generating, setGenerating] = useState(false)
  const [step, setStep]             = useState<GenerateStep | null>(null)
  const [result, setResult]         = useState<string | null>(null)
  const [copied, setCopied]         = useState(false)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getProfileWithSkills(user.id),
      getApplications(user.id),
    ]).then(([p, apps]) => {
      setProfile(p)
      setApplications(apps)
      if (!selectedId && apps.length > 0) setSelectedId(apps[0].id)
    })
  }, [user, selectedId])

  const selectedApp = applications?.find(a => a.id === selectedId) ?? null

  async function handleGenerate() {
    if (!profile || !selectedApp) return
    setError(null)
    setResult(null)
    setGenerating(true)

    const { data, error } = await generateCV(profile, selectedApp, setStep)

    setGenerating(false)
    setStep(null)
    if (error) { setError(error); return }
    setResult(data?.content ?? null)
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const profileIncomplete = !profile?.full_name || profile.skill_items.length === 0
  const loading = profile === null || applications === null

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-4">

      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Generate CV</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          AI tailors your CV to the job using only your real experience.
        </p>
      </div>

      {/* Config card */}
      <div className="rounded-2xl border border-border bg-card px-6 py-5 space-y-5">

        {profileIncomplete && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Complete your profile first — add your name and at least one skill.
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="job-select" className="text-sm font-medium text-foreground">
            Job application
          </label>
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet. Add one in the Applications tab first.
            </p>
          ) : (
            <select
              id="job-select"
              name="job-select"
              value={selectedId}
              onChange={e => { setSelectedId(e.target.value); setResult(null); setError(null) }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.role_title} at {app.company_name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            size="md"
            className="gap-2"
            onClick={handleGenerate}
            loading={generating}
            disabled={!selectedApp || profileIncomplete || generating}
          >
            <Sparkles size={14} />
            Generate CV
          </Button>
          {generating && step && <StepIndicator step={step} />}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-border bg-card px-6 py-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Generated CV
            </h2>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap rounded-xl border border-border bg-background px-5 py-4 text-sm text-foreground font-sans leading-relaxed">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
