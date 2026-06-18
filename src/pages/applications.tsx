import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button, Spinner } from '@/components/ui'
import { JobForm } from '@/components/job/job-form'
import { JobCard } from '@/components/job/job-card'
import { getApplications, addApplication, deleteApplication, updateStatus } from '@/lib/api/applications'
import type { JobApplication, JobApplicationInput, ApplicationStatus } from '@/types'

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<JobApplication[] | null>(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!user) return
    getApplications(user.id).then(data => setApplications(data))
  }, [user])

  async function handleAdd(input: JobApplicationInput) {
    if (!user) return
    const { data, error } = await addApplication(user.id, input)
    if (!error && data) {
      setApplications(prev => [data, ...(prev ?? [])])
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    await deleteApplication(id)
    setApplications(prev => prev?.filter(a => a.id !== id) ?? [])
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    await updateStatus(id, status)
    setApplications(prev =>
      prev?.map(a => a.id === id ? { ...a, status } : a) ?? []
    )
  }

  const count = applications?.length ?? 0

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Applications</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {applications === null ? 'Loading...' : count === 0 ? 'No applications yet' : `${count} application${count !== 1 ? 's' : ''}`}
          </p>
        </div>
        {!adding && (
          <Button variant="primary" size="sm" className="gap-1.5" onClick={() => setAdding(true)}>
            <Plus size={13} />
            New
          </Button>
        )}
      </div>

      {/* New application form */}
      {adding && (
        <div className="rounded-2xl border border-border bg-card px-6 py-5">
          <JobForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      {/* List */}
      {applications === null ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : applications.length === 0 && !adding ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <p className="text-sm font-medium text-foreground">No applications yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Paste a job posting above to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <JobCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
