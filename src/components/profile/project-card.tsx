import { Pencil, Trash2, ExternalLink } from 'lucide-react'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="rounded-md border border-border bg-card px-4 py-4 space-y-1.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{project.title}</p>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink size={12} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onEdit(project.id)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Edit">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(project.id)} className="text-muted-foreground hover:text-red-500 transition-colors" aria-label="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {project.stack.length > 0 && (
        <p className="text-xs text-muted-foreground">{project.stack.join(' · ')}</p>
      )}

      <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
    </div>
  )
}
