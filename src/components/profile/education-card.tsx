import { Pencil, Trash2 } from 'lucide-react'
import type { Education } from '@/types'

interface EducationCardProps {
  education: Education
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function EducationCard({ education, onEdit, onDelete }: EducationCardProps) {
  const dateRange = education.end_date
    ? `${education.start_date} to ${education.end_date}`
    : `${education.start_date} to Ongoing`

  return (
    <div className="rounded-md border border-border bg-card px-4 py-4 space-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{education.degree}</p>
          <p className="text-xs text-muted-foreground">
            {education.institution}{education.specialisation ? ` · ${education.specialisation}` : ''} · {dateRange}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onEdit(education.id)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Edit">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(education.id)} className="text-muted-foreground hover:text-red-500 transition-colors" aria-label="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {education.courses.length > 0 && (
        <p className="text-xs text-muted-foreground">{education.courses.join(' · ')}</p>
      )}
    </div>
  )
}
