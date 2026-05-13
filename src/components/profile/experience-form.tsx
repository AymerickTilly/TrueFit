import { useState } from 'react'
import { X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
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
          Write freely — what you did, shipped, or owned. The AI will structure this into bullet points when generating your CV.
        </p>
        <textarea
          value={tasks}
          onChange={e => setTasks(e.target.value)}
          rows={5}
          placeholder="e.g. Built and maintained REST APIs for the internal dashboard. Managed weekly deployments. Helped onboard two new junior devs."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Tools and technologies</label>
        <p className="text-xs text-muted-foreground">Comma-separated list.</p>
        <Input
          value={tools}
          onChange={e => setTools(e.target.value)}
          placeholder="React, Node.js, PostgreSQL, Docker"
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
