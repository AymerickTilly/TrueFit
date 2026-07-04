import { useState } from 'react'
import { Trash2, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
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
  const [confirming, setConfirming] = useState(false)

  const date = new Intl.DateTimeFormat('en-NZ', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(application.created_at))

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-4 space-y-3 transition-colors duration-150 hover:border-border/80">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{application.role_title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span translate="no">{application.company_name}</span>
            {' · '}Added {date}
          </p>
        </div>
        {confirming ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">Delete this application?</span>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" className="h-7 px-2 text-xs" onClick={() => onDelete(application.id)}>
              Confirm delete
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              to={`/generate?id=${application.id}`}
              aria-label={`Generate CV for ${application.role_title} at ${application.company_name}`}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <FileText size={14} aria-hidden="true" />
            </Link>
            <button
              onClick={() => setConfirming(true)}
              aria-label={`Delete ${application.role_title} at ${application.company_name}`}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <Trash2 size={13} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <Badge variant={STATUS_VARIANT[application.status]}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
        <select
          value={application.status}
          onChange={e => onStatusChange(application.id, e.target.value as ApplicationStatus)}
          aria-label="Change application status"
          className="text-xs text-muted-foreground bg-transparent border-none cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 rounded"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
