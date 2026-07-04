import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui'
import type { SkillContext, SkillItemInput } from '@/types'

const CONTEXTS: { value: SkillContext; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'academic',     label: 'Academic' },
  { value: 'learning',     label: 'Learning' },
  { value: 'exposure',     label: 'Exposure' },
]

interface SkillEntryFormProps {
  skillName: string
  onAdd: (skill: SkillItemInput) => Promise<void>
  onCancel: () => void
}

export function SkillEntryForm({ skillName, onAdd, onCancel }: SkillEntryFormProps) {
  const [context, setContext]  = useState<SkillContext>('professional')
  const [description, setDesc] = useState('')
  const [saving, setSaving]    = useState(false)

  async function handleAdd() {
    setSaving(true)
    await onAdd({
      name: skillName,
      context,
      usage_description: description,
      category: 'Other',
      is_learning: context === 'learning',
    })
    setSaving(false)
  }

  return (
    <div className="rounded-md border border-border bg-muted/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{skillName}</span>
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <fieldset className="space-y-1.5 border-none p-0">
        <legend className="text-xs text-muted-foreground">How did you use this skill?</legend>
        <div className="flex flex-wrap gap-2 pt-1">
          {CONTEXTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setContext(value)}
              aria-pressed={context === value}
              className={[
                'rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                context === value
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="skill-description" className="text-xs text-muted-foreground">
          Brief description: what did you build or do with it? (optional)
        </label>
        <textarea
          id="skill-description"
          value={description}
          onChange={e => setDesc(e.target.value)}
          rows={2}
          placeholder="e.g. Built REST APIs with FastAPI for a student project"
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" loading={saving} onClick={handleAdd}>
          Add skill
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
