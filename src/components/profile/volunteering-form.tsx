import { useState } from 'react'
import { X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import type { Volunteering } from '@/types'

type VolunteeringInput = Omit<Volunteering, 'id'>

interface VolunteeringFormProps {
  initial?: Volunteering
  onSave: (data: VolunteeringInput) => void
  onCancel: () => void
}

export function VolunteeringForm({ initial, onSave, onCancel }: VolunteeringFormProps) {
  const [role, setRole]               = useState(initial?.role ?? '')
  const [organisation, setOrg]        = useState(initial?.organisation ?? '')
  const [date, setDate]               = useState(initial?.date ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  function handleSave() {
    if (!role.trim() || !organisation.trim()) return
    onSave({
      role:         role.trim(),
      organisation: organisation.trim(),
      date:         date.trim(),
      description:  description.trim(),
    })
  }

  return (
    <div className="rounded-md border border-border bg-muted/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {initial ? 'Edit volunteering' : 'Add volunteering'}
        </p>
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Role" value={role} onChange={e => setRole(e.target.value)} placeholder="Volunteer Tutor" required />
        <Input label="Organisation" value={organisation} onChange={e => setOrg(e.target.value)} placeholder="Code Club NZ" required />
        <Input label="Date / period" value={date} onChange={e => setDate(e.target.value)} placeholder="Jan 2024 to Mar 2024" />
        <div />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="vol-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="vol-description"
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Taught Python basics to secondary school students once a week."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleSave}
          disabled={!role.trim() || !organisation.trim()}>
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}
