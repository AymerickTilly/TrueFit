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

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a job offer to generate a tailored CV.
          </p>
        </div>
        {!adding && (
          <Button variant="primary" size="sm" className="gap-1.5" onClick={() => setAdding(true)}>
            <Plus size={13} /> New application
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {adding && (
          <JobForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        )}

        {applications === null ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : applications.length === 0 && !adding ? (
          <div className="rounded-md border border-dashed border-border px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">No applications yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add one by pasting a job posting above.
            </p>
          </div>
        ) : (
          applications.map(app => (
            <JobCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  )
}
