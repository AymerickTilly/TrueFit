import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, Check, Sparkles, FileText, Settings2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button, Spinner } from '@/components/ui'
import { JobForm } from '@/components/job/job-form'
import { getProfileWithSkills } from '@/lib/api/profile'
import { getApplications, addApplication } from '@/lib/api/applications'
import { generateCV, type GenerateStep } from '@/lib/api/generate'
import type { ProfileWithSkills, JobApplication, JobApplicationInput } from '@/types'

const STEP_LABELS: Record<GenerateStep, string> = {
  analyzing:  'Analysing job requirements…',
  generating: 'Writing your CV…',
}

export default function GeneratePage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [profile, setProfile]           = useState<ProfileWithSkills | null>(null)
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading]           = useState(true)
  const [mode, setMode]                 = useState<'select' | 'new'>(searchParams.get('id') ? 'select' : 'new')
  const [generating, setGenerating]     = useState(false)
  const [step, setStep]                 = useState<GenerateStep | null>(null)
  const [result, setResult]             = useState<string | null>(null)
  const [copied, setCopied]             = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [savedNotice, setSavedNotice]   = useState<string | null>(null)
  const [mobileTab, setMobileTab]       = useState<'setup' | 'output'>('setup')

  const selectedId = searchParams.get('id') ?? ''

  function selectApplication(id: string) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (id) next.set('id', id); else next.delete('id')
      return next
    }, { replace: true })
    setResult(null); setError(null)
  }

  useEffect(() => {
    if (!user) return
    Promise.all([getProfileWithSkills(user.id), getApplications(user.id)]).then(([p, apps]) => {
      setProfile(p)
      setApplications(apps)
      setLoading(false)
      if (!searchParams.get('id') && apps.length > 0) {
        setSearchParams(prev => {
          const next = new URLSearchParams(prev)
          next.set('id', apps[0].id)
          return next
        }, { replace: true })
        setMode('select')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const selectedApp       = applications.find(a => a.id === selectedId) ?? null
  const profileIncomplete = !profile?.full_name || profile.skill_items.length === 0

  async function runGenerate(app: JobApplication) {
    if (!profile) return
    setError(null); setResult(null); setGenerating(true)
    const { data, error } = await generateCV(profile, app, setStep)
    setGenerating(false); setStep(null)
    if (error) { setError(error); return }
    setResult(data?.content ?? null)
    setMobileTab('output')
  }

  async function handleGenerate() {
    if (!selectedApp) return
    await runGenerate(selectedApp)
  }

  async function handleNewJobSubmit(input: JobApplicationInput) {
    if (!user) return
    setError(null); setSavedNotice(null)
    const { data: newApp, error: addError } = await addApplication(user.id, input)
    if (addError || !newApp) { setError(addError ?? 'Could not save application.'); return }
    setApplications(prev => [newApp, ...prev])
    setMode('select')
    selectApplication(newApp.id)
    if (profileIncomplete) {
      setSavedNotice('Application saved — complete your profile to generate a CV.')
      return
    }
    await runGenerate(newApp)
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-52px)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Controls panel (shared between mobile and desktop) ──
  const controlsPanel = (
    <div className="space-y-6 px-6 py-8">
      <div>
        <h1 className="font-display text-base font-semibold text-foreground">Generate CV</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Only what you've listed — nothing invented.
        </p>
      </div>

      {profileIncomplete && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-400">
          Complete your profile first — add your name and at least one skill.
        </div>
      )}

      {mode === 'new' ? (
        <div className="space-y-2">
          <JobForm
            onSave={handleNewJobSubmit}
            onCancel={() => { if (applications.length > 0) setMode('select') }}
          />
          {applications.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Paste a job posting above — TrueFit will save it and tailor your CV to it.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="job-select" className="block text-xs font-medium text-foreground">
            Job application
          </label>
          <select
            id="job-select"
            name="job-select"
            value={selectedId}
            onChange={e => selectApplication(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground cursor-pointer transition-colors duration-150 hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
          >
            {applications.map(app => (
              <option key={app.id} value={app.id}>
                {app.role_title} · {app.company_name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setMode('new')}
            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Paste a different job instead
          </button>
        </div>
      )}

      {profile && (
        <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-1">
          <p className="text-xs font-medium text-foreground">Profile snapshot</p>
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

      {mode === 'select' && (
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
            <p
              className="text-center text-xs text-muted-foreground motion-safe:animate-pulse"
              aria-live="polite"
              aria-atomic="true"
            >
              {STEP_LABELS[step]}
            </p>
          )}
        </div>
      )}

      {savedNotice && (
        <p className="text-xs text-muted-foreground" role="status">{savedNotice}</p>
      )}
      {error && (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      )}
    </div>
  )

  // ── Output panel (shared) ──
  const outputPanel = result ? (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-10">
      <div className="mb-6 flex items-center justify-between">
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
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 text-center px-6 py-16">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background">
        <FileText size={18} className="text-muted-foreground" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">No CV yet</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {mode === 'new' ? 'Paste a job and hit Save.' : 'Select a job and hit Generate.'}
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Mobile: tab bar + stacked panels ── */}
      <div className="flex flex-col lg:hidden" style={{ minHeight: 'calc(100vh - 52px)' }}>

        {/* Tab switcher */}
        <div className="flex border-b border-border bg-card shrink-0" role="tablist" aria-label="Generate sections">
          <button
            role="tab"
            aria-selected={mobileTab === 'setup'}
            aria-controls="panel-setup"
            onClick={() => setMobileTab('setup')}
            className={[
              'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-150',
              mobileTab === 'setup'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <Settings2 size={14} aria-hidden="true" />
            Setup
          </button>
          <button
            role="tab"
            aria-selected={mobileTab === 'output'}
            aria-controls="panel-output"
            onClick={() => setMobileTab('output')}
            className={[
              'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-150',
              mobileTab === 'output'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <FileText size={14} aria-hidden="true" />
            Output
            {result && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
          </button>
        </div>

        {/* Tab panels */}
        <div
          id="panel-setup"
          role="tabpanel"
          hidden={mobileTab !== 'setup'}
          className="overflow-y-auto"
        >
          {controlsPanel}
        </div>
        <div
          id="panel-output"
          role="tabpanel"
          hidden={mobileTab !== 'output'}
          className="overflow-y-auto flex-1"
        >
          {outputPanel}
        </div>
      </div>

      {/* ── Desktop: side-by-side split ── */}
      <div className="hidden lg:flex" style={{ height: 'calc(100vh - 52px)' }}>
        <aside className="w-72 shrink-0 overflow-y-auto border-r border-border bg-background">
          {controlsPanel}
        </aside>
        <div className="flex-1 overflow-y-auto bg-card border-l border-border">
          {outputPanel}
        </div>
      </div>
    </>
  )
}
