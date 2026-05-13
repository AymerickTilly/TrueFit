import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { Button, Input } from '@/components/ui'
import type { Interest, Profile } from '@/types'

interface InterestsSectionProps {
  interests: Interest[]
  onSave: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

export function InterestsSection({ interests, onSave }: InterestsSectionProps) {
  const [items, setItems]   = useState<Interest[]>(interests)
  const [adding, setAdding] = useState(false)
  const [name, setName]     = useState('')
  const [desc, setDesc]     = useState('')

  async function persist(updated: Interest[]) {
    setItems(updated)
    await onSave({ interests: updated })
  }

  function handleAdd() {
    if (!name.trim()) return
    persist([...items, { id: uuid(), name: name.trim(), description: desc.trim() }])
    setName('')
    setDesc('')
    setAdding(false)
  }

  function handleDelete(id: string) {
    persist(items.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5"
            title={item.description || undefined}
          >
            <span className="text-sm text-foreground">{item.name}</span>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-muted-foreground hover:text-red-500 transition-colors"
              aria-label="Remove"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="rounded-md border border-border bg-muted/40 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Interest"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Surfing"
              required
            />
            <Input
              label="Short note (optional)"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Competitive surf club since 2019"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleAdd} disabled={!name.trim()}>
              Add
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setName(''); setDesc('') }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setAdding(true)}>
          <Plus size={13} /> Add interest
        </Button>
      )}

      {items.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">No interests added yet.</p>
      )}
    </div>
  )
}
