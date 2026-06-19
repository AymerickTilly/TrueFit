import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import { SkillSearch } from '@/components/profile/skill-search'
import { SkillEntryForm } from '@/components/profile/skill-entry-form'
import { SkillCard } from '@/components/profile/skill-card'
import { getSkills, addSkill, deleteSkill } from '@/lib/api/skills'
import type { SkillItem, SkillItemInput } from '@/types'

interface SkillsSectionProps {
  profileId: string | undefined
}

export function SkillsSection({ profileId }: SkillsSectionProps) {
  // null = not yet fetched, SkillItem[] = fetched (may be empty)
  const [skills, setSkills] = useState<SkillItem[] | null>(null)
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    if (!profileId) return
    getSkills(profileId).then(data => setSkills(data))
  }, [profileId])

  async function handleAdd(input: SkillItemInput) {
    if (!profileId) return
    const { data, error } = await addSkill(profileId, {
      ...input,
      sort_order: skills?.length ?? 0,
    })
    if (!error && data) {
      setSkills(prev => [...(prev ?? []), data])
    }
    setPending(null)
  }

  async function handleDelete(id: string) {
    await deleteSkill(id)
    setSkills(prev => prev?.filter(s => s.id !== id) ?? [])
  }

  if (!profileId) {
    return (
      <p className="text-sm text-muted-foreground">
        Save your personal info first to add skills.
      </p>
    )
  }

  if (skills === null) return <Spinner size="sm" />

  return (
    <div className="space-y-4">
      {pending ? (
        <SkillEntryForm
          skillName={pending}
          onAdd={handleAdd}
          onCancel={() => setPending(null)}
        />
      ) : (
        <SkillSearch
          onSelect={setPending}
          exclude={skills.map(s => s.name)}
        />
      )}

      {skills.length > 0 && skills !== null && (
        <>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: SkillItem) => (
              <SkillCard key={skill.id} skill={skill} onDelete={handleDelete} />
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            disabled
            title="AI categorisation coming soon"
          >
            <Sparkles size={13} />
            Categorise with AI
          </Button>
        </>
      )}

      {skills.length === 0 && !pending && skills !== null && (
        <p className="text-sm text-muted-foreground">
          No skills yet. Search above to add your first one.
        </p>
      )}
    </div>
  )
}
