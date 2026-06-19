import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, Check, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button, Spinner } from '@/components/ui'
import { getProfileWithSkills } from '@/lib/api/profile'
import { getApplications } from '@/lib/api/applications'
import { generateCV, type GenerateStep } from '@/lib/api/generate'
import type { ProfileWithSkills, JobApplication } from '@/types'

const STEP_LABELS: Record<GenerateStep, string> = {
  analyzing:  'Analysing job requirements…',
  generating: 'Writing your CV…',
}

export default function GeneratePage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  const [profile, setProfile]           = useState<ProfileWithSkills | null>(null)
  const [applications, setApplications] = useState<JobApplication[] | null>(null)
  const [selectedId, setSelectedId]     = useState<string>(searchParams.get('id') ?? '')
  const [generating, setGenerating]     = useState(false)
  const [step, setStep]                 = useState<GenerateStep | null>(null)
  const [result, setResult]             = useState<string | null>(null)
  const [copied, setCopied]             = useState(false)
  const [error, setError]               = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    Promise.all([getProfileWithSkills(user.id), getApplications(user.id)]).then(([p, apps]) => {
      setProfile(p)
      setApplications(apps)
      if (!selectedId && apps.length > 0) setSelectedId(apps[0].id)
    })
  }, [user, selectedId])

  const selectedApp     = applications?.find(a => a.id === selectedId) ?? null
  const profileIncomplete = !profile?.full_name || profile.skill_items.length === 0

  async function handleGenerate() {
    if (!profile || !selectedApp) return
    setError(null); setResult(null); setGenerating(true)
    const { data, error } = await generateCV(profile, selectedApp, setStep)
    setGenerating(false); setStep(null)
    if (error) { setError(error); return }
    setResult(data?.content ?? null)
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (profile === null || applications === null) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-10 space-y-8">

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Generate CV</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          TrueFit selects and frames only what you've listed — nothing invented.
        </p>
      </div>

      {profileIncomplete && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Complete your profile first — add your name and at least one skill.
        </div>
      )}

      <div className="space-y-3">
        <label htmlFor="job-select" className="block text-sm font-medium text-foreground">
          Job application
        </label>
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No applications yet. Add one in Applications first.
          </p>
        ) : (
          <select
            id="job-select"
            name="job-select"
            value={selectedId}
            onChange={e => { setSelectedId(e.target.value); setResult(null); setError(null) }}
            className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer"
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
          Generate
        </Button>
        {generating && step && (
          <p className="text-sm text-muted-foreground motion-safe:animate-pulse">
            {STEP_LABELS[step]}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Generated CV</h2>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap rounded-xl border border-border bg-card px-6 py-5 text-sm text-foreground font-sans leading-relaxed">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
