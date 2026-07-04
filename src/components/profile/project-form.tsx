import { useState } from 'react'
import { X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import type { Project } from '@/types'

type ProjectInput = Omit<Project, 'id'>

interface ProjectFormProps {
  initial?: Project
  onSave: (data: ProjectInput) => void
  onCancel: () => void
}

export function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [title, setTitle]         = useState(initial?.title ?? '')
  const [description, setDesc]    = useState(initial?.description ?? '')
  const [stack, setStack]         = useState(initial?.stack.join(', ') ?? '')
  const [skills, setSkills]       = useState(initial?.skills_demonstrated.join(', ') ?? '')
  const [githubUrl, setGithubUrl] = useState(initial?.github_url ?? '')

  function handleSave() {
    if (!title.trim() || !description.trim()) return
    onSave({
      title:               title.trim(),
      description:         description.trim(),
      stack:               stack.split(',').map(s => s.trim()).filter(Boolean),
      skills_demonstrated: skills.split(',').map(s => s.trim()).filter(Boolean),
      github_url:          githubUrl.trim(),
      not_in_project:      initial?.not_in_project ?? [],
    })
  }

  return (
    <div className="rounded-md border border-border bg-muted/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {initial ? 'Edit project' : 'Add project'}
        </p>
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Project name" value={title} onChange={e => setTitle(e.target.value)} placeholder="TrueFit" required />
        <Input label="GitHub URL" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/you/project" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="proj-description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <p className="text-xs text-muted-foreground">
          What does it do and why did you build it? Write freely — the AI will shape this at generation time.
        </p>
        <textarea
          id="proj-description"
          value={description}
          onChange={e => setDesc(e.target.value)}
          rows={3}
          placeholder="e.g. An AI-powered CV generator that tailors your profile to job offers without fabricating experience. Built with React, Supabase, and the Gemini API."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Tech stack</label>
        <p className="text-xs text-muted-foreground">Comma-separated.</p>
        <Input value={stack} onChange={e => setStack(e.target.value)} placeholder="React, TypeScript, Supabase, Tailwind CSS" />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Skills demonstrated</label>
        <p className="text-xs text-muted-foreground">What does this project prove you can do? Comma-separated.</p>
        <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Full-stack development, API design, auth, deployment" />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={handleSave}
          disabled={!title.trim() || !description.trim()}>
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}
