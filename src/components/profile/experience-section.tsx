import { useState } from 'react'
import { Plus } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { Button } from '@/components/ui'
import { ExperienceCard } from '@/components/profile/experience-card'
import { ExperienceForm } from '@/components/profile/experience-form'
import type { WorkExperience, Profile } from '@/types'

type ExperienceInput = Omit<WorkExperience, 'id'>

interface ExperienceSectionProps {
  experience: WorkExperience[]
  onSave: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

export function ExperienceSection({ experience, onSave }: ExperienceSectionProps) {
  const [items, setItems]       = useState<WorkExperience[]>(experience)
  const [adding, setAdding]     = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function persist(updated: WorkExperience[]) {
    setItems(updated)
    await onSave({ work_experience: updated })
  }

  function handleAdd(input: ExperienceInput) {
    const updated = [{ ...input, id: uuid() }, ...items]
    persist(updated)
    setAdding(false)
  }

  function handleEdit(id: string, input: ExperienceInput) {
    const updated = items.map(item => item.id === id ? { ...input, id } : item)
    persist(updated)
    setEditingId(null)
  }

  function handleDelete(id: string) {
    persist(items.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-3">
      {!adding && (
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setAdding(true)}>
          <Plus size={13} />
          Add position
        </Button>
      )}

      {adding && (
        <ExperienceForm
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
        />
      )}

      {items.map(item =>
        editingId === item.id ? (
          <ExperienceForm
            key={item.id}
            initial={item}
            onSave={input => handleEdit(item.id, input)}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <ExperienceCard
            key={item.id}
            experience={item}
            onEdit={setEditingId}
            onDelete={handleDelete}
          />
        )
      )}

      {items.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">No positions yet.</p>
      )}
    </div>
  )
}
