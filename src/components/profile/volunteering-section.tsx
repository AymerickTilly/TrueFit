import { useState } from 'react'
import { Plus } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { Button } from '@/components/ui'
import { VolunteeringCard } from '@/components/profile/volunteering-card'
import { VolunteeringForm } from '@/components/profile/volunteering-form'
import type { Volunteering, Profile } from '@/types'

type VolunteeringInput = Omit<Volunteering, 'id'>

interface VolunteeringSectionProps {
  volunteering: Volunteering[]
  onSave: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

export function VolunteeringSection({ volunteering, onSave }: VolunteeringSectionProps) {
  const [items, setItems]         = useState<Volunteering[]>(volunteering)
  const [adding, setAdding]       = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function persist(updated: Volunteering[]) {
    setItems(updated)
    await onSave({ volunteering: updated })
  }

  function handleAdd(input: VolunteeringInput) {
    persist([{ ...input, id: uuid() }, ...items])
    setAdding(false)
  }

  function handleEdit(id: string, input: VolunteeringInput) {
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
          <Plus size={13} /> Add volunteering
        </Button>
      )}

      {adding && <VolunteeringForm onSave={handleAdd} onCancel={() => setAdding(false)} />}

      {items.map(item =>
        editingId === item.id ? (
          <VolunteeringForm key={item.id} initial={item} onSave={input => handleEdit(item.id, input)} onCancel={() => setEditingId(null)} />
        ) : (
          <VolunteeringCard key={item.id} item={item} onEdit={setEditingId} onDelete={handleDelete} />
        )
      )}

      {items.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">No volunteering added yet.</p>
      )}
    </div>
  )
}
