import { useState, useRef } from 'react'
import { Search } from 'lucide-react'
import { SKILL_SUGGESTIONS } from '@/lib/data/skill-suggestions'

interface SkillSearchProps {
  onSelect: (name: string) => void
  exclude: string[]
}

export function SkillSearch({ onSelect, exclude }: SkillSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.length < 1 ? [] : SKILL_SUGGESTIONS
    .filter(s => !exclude.includes(s))
    .filter(s => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8)

  const showCustom = query.length > 1
    && !SKILL_SUGGESTIONS.some(s => s.toLowerCase() === query.toLowerCase())
    && !exclude.some(s => s.toLowerCase() === query.toLowerCase())

  function select(name: string) {
    onSelect(name)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-foreground/20">
        <Search size={14} className="shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search or add a skill…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {open && (filtered.length > 0 || showCustom) && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card py-1 shadow-md">
          {filtered.map(name => (
            <li key={name}>
              <button
                onMouseDown={() => select(name)}
                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
              >
                {name}
              </button>
            </li>
          ))}
          {showCustom && (
            <li>
              <button
                onMouseDown={() => select(query.trim())}
                className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
              >
                Add &ldquo;{query.trim()}&rdquo;
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
