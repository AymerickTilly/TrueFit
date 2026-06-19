import { useState, useEffect } from 'react'
import { Plus, Briefcase } from 'lucide-react'
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
    if (!error && data) setApplications(prev => [data, ...(prev ?? [])])
    setAdding(false)
  }

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
    <div className="mx-auto max-w-3xl px-8 py-10">

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {applications === null ? '' : count === 0 ? 'No applications yet.' : `${count} application${count !== 1 ? 's' : ''}`}
          </p>
        </div>
        {!adding && (
          <Button variant="primary" size="sm" className="gap-1.5 mt-0.5" onClick={() => setAdding(true)}>
            <Plus size={13} /> New
          </Button>
        )}
      </div>

      {adding && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <JobForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      {applications === null ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : applications.length === 0 && !adding ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Briefcase size={20} />
          </div>
          <p className="text-sm font-medium text-foreground">No applications yet</p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Click <strong>New</strong> to paste a job posting and TrueFit will tailor your CV to it.
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
