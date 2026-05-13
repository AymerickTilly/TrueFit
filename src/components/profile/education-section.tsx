import { useState } from 'react'
import { Plus } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { Button } from '@/components/ui'
import { EducationCard } from '@/components/profile/education-card'
import { EducationForm } from '@/components/profile/education-form'
import type { Education, Profile } from '@/types'

type EducationInput = Omit<Education, 'id'>

interface EducationSectionProps {
  education: Education[]
  onSave: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

export function EducationSection({ education, onSave }: EducationSectionProps) {
  const [items, setItems]         = useState<Education[]>(education)
  const [adding, setAdding]       = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function persist(updated: Education[]) {
    setItems(updated)
    await onSave({ education: updated })
  }

  function handleAdd(input: EducationInput) {
    persist([{ ...input, id: uuid() }, ...items])
    setAdding(false)
  }

  function handleEdit(id: string, input: EducationInput) {
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
          <Plus size={13} /> Add education
        </Button>
      )}

      {adding && <EducationForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

      {items.map(item =>
        editingId === item.id ? (
          <EducationForm key={item.id} initial={item} onSave={input => handleEdit(item.id, input)} onCancel={() => setEditingId(null)} />
        ) : (
          <EducationCard key={item.id} education={item} onEdit={setEditingId} onDelete={handleDelete} />
        )
      )}

      {items.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">No education added yet.</p>
      )}
    </div>
  )
}
