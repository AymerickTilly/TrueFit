import { useState } from 'react'
import { Plus } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { Button } from '@/components/ui'
import { ProjectCard } from '@/components/profile/project-card'
import { ProjectForm } from '@/components/profile/project-form'
import type { Project, Profile } from '@/types'

type ProjectInput = Omit<Project, 'id'>

interface ProjectSectionProps {
  projects: Project[]
  onSave: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

export function ProjectSection({ projects, onSave }: ProjectSectionProps) {
  const [items, setItems]         = useState<Project[]>(projects)
  const [adding, setAdding]       = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function persist(updated: Project[]) {
    setItems(updated)
    await onSave({ projects: updated })
  }

  function handleAdd(input: ProjectInput) {
    persist([{ ...input, id: uuid() }, ...items])
    setAdding(false)
  }

  function handleEdit(id: string, input: ProjectInput) {
    persist(items.map(item => item.id === id ? { ...input, id } : item))
    setEditingId(null)
  }

  function handleDelete(id: string) {
    persist(items.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-3">
      {!adding && (
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setAdding(true)}>
          <Plus size={13} /> Add project
        </Button>
      )}

      {adding && <ProjectForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

      {items.map(item =>
        editingId === item.id ? (
          <ProjectForm key={item.id} initial={item} onSave={input => handleEdit(item.id, input)} onCancel={() => setEditingId(null)} />
        ) : (
          <ProjectCard key={item.id} project={item} onEdit={setEditingId} onDelete={handleDelete} />
        )
      )}

      {items.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">No projects added yet.</p>
      )}
    </div>
  )
}
