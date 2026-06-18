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
  const [context, setContext]     = useState<SkillContext>('professional')
  const [description, setDesc]    = useState('')
  const [saving, setSaving]       = useState(false)

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
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X size={14} />
        </button>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">How did you use this skill?</p>
        <div className="flex flex-wrap gap-2">
          {CONTEXTS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setContext(value)}
              className={[
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                context === value
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">
          Brief description: what did you build or do with it? (optional)
        </p>
        <textarea
          value={description}
          onChange={e => setDesc(e.target.value)}
          rows={2}
          placeholder="e.g. Built REST APIs with FastAPI for a student project"
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
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
