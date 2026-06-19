import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, Check, Sparkles, FileText } from 'lucide-react'
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

  const selectedApp       = applications?.find(a => a.id === selectedId) ?? null
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
      <div className="flex h-[calc(100vh-52px)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-52px)]">

      {/* ── Left panel — controls (stone-100 bg, matches page bg) ── */}
      <aside className="w-72 shrink-0 overflow-y-auto px-6 py-8 space-y-6">

        <div>
          <h1 className="text-base font-semibold text-foreground">Generate CV</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Only what you've listed — nothing invented.
          </p>
        </div>

        {profileIncomplete && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
            Complete your profile first — add your name and at least one skill.
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="job-select" className="block text-xs font-medium text-foreground">
            Job application
          </label>
          {applications.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No applications yet. Add one first.
            </p>
          ) : (
            <select
              id="job-select"
              name="job-select"
              value={selectedId}
              onChange={e => { setSelectedId(e.target.value); setResult(null); setError(null) }}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/25 cursor-pointer"
            >
              {applications.map(app => (
                <option key={app.id} value={app.id}>
                  {app.role_title} · {app.company_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {profile && (
          <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-1">
            <p className="text-xs font-medium text-foreground">Profile</p>
            <p className="text-xs text-muted-foreground">
              {profile.skill_items.length} skill{profile.skill_items.length !== 1 ? 's' : ''}
              {profile.work_experience?.length
                ? ` · ${profile.work_experience.length} role${profile.work_experience.length !== 1 ? 's' : ''}`
                : ''}
              {profile.projects?.length
                ? ` · ${profile.projects.length} project${profile.projects.length !== 1 ? 's' : ''}`
                : ''}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="primary"
            size="md"
            className="w-full gap-2 justify-center"
            onClick={handleGenerate}
            loading={generating}
            disabled={!selectedApp || profileIncomplete || generating}
          >
            <Sparkles size={14} aria-hidden="true" />
            Generate
          </Button>

          {generating && step && (
            <p className="text-center text-xs text-muted-foreground motion-safe:animate-pulse" aria-live="polite">
              {STEP_LABELS[step]}
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600" role="alert">{error}</p>
          )}
        </div>
      </aside>

      {/* ── Right panel — output (white surface) ── */}
      <div className="flex-1 overflow-y-auto bg-card border-l border-border">
        {result ? (
          <div className="mx-auto max-w-2xl px-10 py-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Generated CV</h2>
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleCopy}>
                {copied
                  ? <><Check size={13} aria-hidden="true" />Copied</>
                  : <><Copy size={13} aria-hidden="true" />Copy</>
                }
              </Button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {result}
            </pre>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
              <FileText size={18} className="text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No CV yet</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Select a job and hit Generate.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
