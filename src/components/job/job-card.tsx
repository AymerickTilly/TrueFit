import { Trash2, FileText } from 'lucide-react'
import { Badge } from '@/components/ui'
import type { JobApplication, ApplicationStatus } from '@/types'

const STATUS_VARIANT: Record<ApplicationStatus, 'default' | 'secondary' | 'success' | 'destructive' | 'outline'> = {
  draft:        'outline',
  applied:      'secondary',
  interviewing: 'default',
  rejected:     'destructive',
  offered:      'success',
}

interface JobCardProps {
  application: JobApplication
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
}

const STATUSES: ApplicationStatus[] = ['draft', 'applied', 'interviewing', 'rejected', 'offered']

export function JobCard({ application, onDelete, onStatusChange }: JobCardProps) {
  const date = new Date(application.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="rounded-md border border-border bg-card px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{application.role_title}</p>
          <p className="text-xs text-muted-foreground">{application.company_name} · Added {date}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            disabled
            title="Generate CV — coming soon"
            className="text-muted-foreground opacity-40 cursor-not-allowed"
          >
            <FileText size={14} />
          </button>
          <button
            onClick={() => onDelete(application.id)}
            className="text-muted-foreground hover:text-red-500 transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={STATUS_VARIANT[application.status]}>{application.status}</Badge>
        <select
          value={application.status}
          onChange={e => onStatusChange(application.id, e.target.value as ApplicationStatus)}
          className="text-xs text-muted-foreground bg-transparent border-none focus:outline-none cursor-pointer hover:text-foreground"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
