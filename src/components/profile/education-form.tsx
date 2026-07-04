import { useState } from 'react'
import { X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import type { Education } from '@/types'

type EducationInput = Omit<Education, 'id'>

interface EducationFormProps {
  initial?: Education
  onSave: (data: EducationInput) => void
  onCancel: () => void
}

export function EducationForm({ initial, onSave, onCancel }: EducationFormProps) {
  const [degree, setDegree]           = useState(initial?.degree ?? '')
  const [institution, setInstitution] = useState(initial?.institution ?? '')
  const [specialisation, setSpec]     = useState(initial?.specialisation ?? '')
  const [startDate, setStartDate]     = useState(initial?.start_date ?? '')
  const [endDate, setEndDate]         = useState(initial?.end_date ?? '')
  const [courses, setCourses]         = useState(initial?.courses.join(', ') ?? '')

  function handleSave() {
    if (!degree.trim() || !institution.trim() || !startDate.trim()) return
    onSave({
      degree:         degree.trim(),
      institution:    institution.trim(),
      specialisation: specialisation.trim(),
      start_date:     startDate.trim(),
      end_date:       endDate.trim() || null,
      courses:        courses.split(',').map(c => c.trim()).filter(Boolean),
    })
  }

  return (
    <div className="rounded-md border border-border bg-muted/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {initial ? 'Edit education' : 'Add education'}
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
        <Input label="Degree / qualification" value={degree} onChange={e => setDegree(e.target.value)} placeholder="BSc Computer Science" required />
        <Input label="Institution" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="University of Paris" required />
        <Input label="Specialisation" value={specialisation} onChange={e => setSpec(e.target.value)} placeholder="Artificial Intelligence" />
        <div />
        <Input label="Start date" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Sep 2021" required />
        <Input label="End date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="Jun 2024 (or leave blank if ongoing)" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="edu-courses" className="text-sm font-medium text-foreground">
          Relevant courses
        </label>
        <p className="text-xs text-muted-foreground">Comma-separated. Only include courses worth highlighting for technical roles.</p>
        <Input
          id="edu-courses"
          value={courses}
          onChange={e => setCourses(e.target.value)}
          placeholder="Algorithms, Databases, Machine Learning, Software Engineering"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleSave}
          disabled={!degree.trim() || !institution.trim() || !startDate.trim()}>
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}
