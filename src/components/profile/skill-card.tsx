import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui'
import type { SkillItem, SkillContext } from '@/types'

const CONTEXT_VARIANT: Record<SkillContext, 'default' | 'secondary' | 'success' | 'outline'> = {
  professional: 'default',
  academic:     'secondary',
  learning:     'success',
  exposure:     'outline',
}

interface SkillCardProps {
  skill: SkillItem
  onDelete: (id: string) => void
}

export function SkillCard({ skill, onDelete }: SkillCardProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-card px-4 py-3">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{skill.name}</span>
          <Badge variant={CONTEXT_VARIANT[skill.context]}>{skill.context}</Badge>
        </div>
        {skill.usage_description && (
          <p className="text-xs text-muted-foreground">{skill.usage_description}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(skill.id)}
        className="shrink-0 text-muted-foreground transition-colors hover:text-red-500"
        aria-label="Delete skill"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
