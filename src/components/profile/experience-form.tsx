import { useState } from 'react'
import { X, Sparkles, Check } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { improveTasks } from '@/lib/api/improve-tasks'
import type { WorkExperience } from '@/types'

type ExperienceInput = Omit<WorkExperience, 'id'>

interface ExperienceFormProps {
  initial?: WorkExperience
  onSave: (data: ExperienceInput) => void
  onCancel: () => void
}

export function ExperienceForm({ initial, onSave, onCancel }: ExperienceFormProps) {
  const [title, setTitle]         = useState(initial?.title ?? '')
  const [company, setCompany]     = useState(initial?.company ?? '')
  const [startDate, setStartDate] = useState(initial?.start_date ?? '')
  const [endDate, setEndDate]     = useState(initial?.end_date ?? '')
  const [isCurrent, setIsCurrent] = useState(initial?.is_current ?? false)
  const [tasks, setTasks]         = useState(initial?.tasks.join('\n') ?? '')
  const [tools, setTools]         = useState(initial?.tools.join(', ') ?? '')

  const [improving, setImproving]   = useState(false)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [improveError, setImproveError] = useState<string | null>(null)

  function handleSave() {
    if (!title.trim() || !company.trim() || !startDate.trim()) return
    onSave({
      title:      title.trim(),
      company:    company.trim(),
      start_date: startDate.trim(),
      end_date:   isCurrent ? null : endDate.trim() || null,
      is_current: isCurrent,
      tasks:      tasks.split('\n').map(t => t.trim()).filter(Boolean),
      tools:      tools.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  async function handleImprove() {
    if (!tasks.trim()) return
    setImproving(true)
    setSuggestion(null)
    setImproveError(null)

    const toolList = tools.split(',').map(t => t.trim()).filter(Boolean)
    const { data, error } = await improveTasks(tasks, toolList, { title, company })

    setImproving(false)
    if (error) { setImproveError(error); return }
    setSuggestion(data)
  }

  function applySuggestion() {
    if (!suggestion) return
    setTasks(suggestion)
    setSuggestion(null)
  }

  return (
    <div className="rounded-md border border-border bg-muted/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {initial ? 'Edit experience' : 'Add experience'}
        </p>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Job title"  value={title}   onChange={e => setTitle(e.target.value)}   placeholder="Software Engineer" required />
        <Input label="Company"    value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" required />
        <Input label="Start date" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Apr 2023" required />
        <div className="space-y-1.5">
          <Input
            label="End date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            placeholder="Jun 2024"
            disabled={isCurrent}
          />
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={e => setIsCurrent(e.target.checked)}
              className="rounded"
            />
            Current position
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Tasks and responsibilities</label>
        <p className="text-xs text-muted-foreground">
          One bullet per line. Write what you did. The AI can help expand with outcome clauses using the tools listed below.
        </p>
        <textarea
          value={tasks}
          onChange={e => { setTasks(e.target.value); setSuggestion(null) }}
          rows={5}
          placeholder={"Automated Linux server deployments\nManaged SQL databases\nMonitored and resolved deployment issues"}
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />

        {tasks.trim() && (
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={handleImprove}
            loading={improving}
            disabled={improving}
          >
            <Sparkles size={13} />
            {improving ? 'Improving…' : 'Improve bullets with AI'}
          </Button>
        )}

        {improveError && (
          <p className="text-xs text-red-500">{improveError}</p>
        )}

        {suggestion && (
          <div className="rounded-md border border-border bg-background p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suggested improvement</p>
            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">{suggestion}</pre>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" className="gap-1.5" onClick={applySuggestion}>
                <Check size={12} /> Apply
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSuggestion(null)}>Dismiss</Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Tools and technologies</label>
        <p className="text-xs text-muted-foreground">Comma-separated. The AI will only use these tools when improving your bullets.</p>
        <Input
          value={tools}
          onChange={e => setTools(e.target.value)}
          placeholder="Ansible, Bash, MySQL, PostgreSQL, Linux"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleSave}
          disabled={!title.trim() || !company.trim() || !startDate.trim()}>
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}
