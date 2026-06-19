import { X } from 'lucide-react'
import type { SkillItem, SkillContext } from '@/types'

const CONTEXT_DOT: Record<SkillContext, string> = {
  professional: 'bg-blue-500',
  academic:     'bg-violet-500',
  learning:     'bg-emerald-500',
  exposure:     'bg-stone-400',
}

interface SkillCardProps {
  skill: SkillItem
  onDelete: (id: string) => void
}

export function SkillCard({ skill, onDelete }: SkillCardProps) {
  return (
    <div
      className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-150 hover:border-red-200 hover:bg-red-50"
      title={skill.usage_description || skill.context}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${CONTEXT_DOT[skill.context]}`} aria-hidden="true" />
      <span>{skill.name}</span>
      <button
        onClick={() => onDelete(skill.id)}
        className="ml-0.5 shrink-0 cursor-pointer opacity-0 transition-opacity duration-150 group-hover:opacity-100 text-red-400 hover:text-red-600"
        aria-label={`Remove ${skill.name}`}
      >
        <X size={11} />
      </button>
    </div>
  )
}
