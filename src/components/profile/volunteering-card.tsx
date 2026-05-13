import { Pencil, Trash2 } from 'lucide-react'
import type { Volunteering } from '@/types'

interface VolunteeringCardProps {
  item: Volunteering
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function VolunteeringCard({ item, onEdit, onDelete }: VolunteeringCardProps) {
  return (
    <div className="rounded-md border border-border bg-card px-4 py-4 space-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{item.role}</p>
          <p className="text-xs text-muted-foreground">
            {item.organisation}{item.date ? ` · ${item.date}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onEdit(item.id)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Edit">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors" aria-label="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {item.description && (
        <p className="text-xs text-muted-foreground">{item.description}</p>
      )}
    </div>
  )
}
