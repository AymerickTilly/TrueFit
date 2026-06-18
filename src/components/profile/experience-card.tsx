import { Pencil, Trash2 } from 'lucide-react'
import type { WorkExperience } from '@/types'

interface ExperienceCardProps {
  experience: WorkExperience
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  const dateRange = experience.is_current
    ? `${experience.start_date} to Present`
    : `${experience.start_date}${experience.end_date ? ` to ${experience.end_date}` : ''}`

  return (
    <div className="rounded-md border border-border bg-card px-4 py-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{experience.title}</p>
          <p className="text-xs text-muted-foreground">{experience.company} · {dateRange}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(experience.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(experience.id)}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {experience.tools.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {experience.tools.join(' · ')}
        </p>
      )}
    </div>
  )
}
