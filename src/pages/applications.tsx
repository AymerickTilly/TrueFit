import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Briefcase } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Spinner } from '@/components/ui'
import { JobCard } from '@/components/job/job-card'
import { getApplications, deleteApplication, updateStatus } from '@/lib/api/applications'
import type { JobApplication, ApplicationStatus } from '@/types'

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<JobApplication[] | null>(null)

  useEffect(() => {
    if (!user) return
    getApplications(user.id).then(data => setApplications(data))
  }, [user])

  async function handleDelete(id: string) {
    await deleteApplication(id)
    setApplications(prev => prev?.filter(a => a.id !== id) ?? [])
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    await updateStatus(id, status)
    setApplications(prev => prev?.map(a => a.id === id ? { ...a, status } : a) ?? [])
  }

  const count = applications?.length ?? 0

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-10">

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {applications === null ? '' : count === 0 ? 'No applications yet.' : `${count} application${count !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          to="/generate"
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 mt-0.5 text-xs font-medium text-primary-foreground shadow-hard-sm shadow-hard-active transition-colors duration-150 hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Sparkles size={13} aria-hidden="true" /> Generate a CV
        </Link>
      </div>

      {applications === null ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Briefcase size={20} aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-foreground">No applications yet</p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Head to <Link to="/generate" className="font-medium text-foreground underline-offset-4 hover:underline">Generate</Link> to paste your first job posting.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <JobCard key={app.id} application={app} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  )
}
