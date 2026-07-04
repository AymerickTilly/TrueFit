import { useState } from 'react'
import { X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import type { JobApplicationInput } from '@/types'

interface JobFormProps {
  onSave: (input: JobApplicationInput) => Promise<void>
  onCancel: () => void
}

export function JobForm({ onSave, onCancel }: JobFormProps) {
  const [company, setCompany]   = useState('')
  const [role, setRole]         = useState('')
  const [url, setUrl]           = useState('')
  const [adText, setAdText]     = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSave() {
    if (!company.trim() || !role.trim() || !adText.trim()) return
    setError(null)
    setSaving(true)
    await onSave({
      company_name:  company.trim(),
      role_title:    role.trim(),
      job_url:       url.trim() || undefined,
      job_ad_text:   adText.trim(),
    })
    setSaving(false)
  }

  const canSave = company.trim() && role.trim() && adText.trim()

  return (
    <div className="rounded-md border border-border bg-muted/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">New application</p>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" required />
        <Input label="Role title" value={role} onChange={e => setRole(e.target.value)} placeholder="Software Engineer" required />
      </div>

      <Input label="Job URL (optional)" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://jobs.example.com/…" />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Job posting</label>
        <p className="text-xs text-muted-foreground">
          Paste the full job ad text. The more detail, the better the CV match.
        </p>
        <textarea
          id="job-ad-text"
          value={adText}
          onChange={e => setAdText(e.target.value)}
          rows={10}
          placeholder="Paste the full job posting here…"
          aria-label="Job posting text"
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button variant="primary" size="sm" loading={saving} disabled={!canSave} onClick={handleSave}>
          Save application
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}
