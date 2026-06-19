import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExpandEditorProps {
  label: string
  description: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  id?: string
}

export function ExpandEditor({ label, description, value, onChange, placeholder, id }: ExpandEditorProps) {
  const [open, setOpen]   = useState(false)
  const [draft, setDraft] = useState(value)
  const dialogRef         = useRef<HTMLDialogElement>(null)
  const textareaRef       = useRef<HTMLTextAreaElement>(null)
  const dialogId          = id ?? label.toLowerCase().replace(/\s+/g, '-')

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
      requestAnimationFrame(() => textareaRef.current?.focus())
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onClose = () => setOpen(false)
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [])

  function handleSave() {
    onChange(draft)
    setOpen(false)
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) setOpen(false)
  }

  const preview   = value.trim()
  const truncated = preview.length > 140 ? preview.slice(0, 137) + '…' : preview

  return (
    <>
      <button
        type="button"
        onClick={() => { setDraft(value); setOpen(true) }}
        aria-label={`Edit ${label}`}
        aria-haspopup="dialog"
        className="group relative w-full rounded-md border border-border bg-background px-3 py-2.5 text-left text-sm transition-colors duration-150 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
      >
        {preview ? (
          <span className="line-clamp-2 text-foreground leading-relaxed">{truncated}</span>
        ) : (
          <span className="text-muted-foreground/50 leading-relaxed">{placeholder}</span>
        )}
        <Maximize2
          size={12}
          className="absolute right-2.5 top-2.5 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          aria-hidden="true"
        />
      </button>

      {createPortal(
        <dialog
          ref={dialogRef}
          onClick={handleBackdropClick}
          aria-labelledby={`${dialogId}-title`}
          aria-modal="true"
          className="m-auto w-full max-w-2xl rounded-2xl border-0 bg-card p-0 shadow-2xl"
        >
          <div className="flex flex-col">
            <div className="border-b border-border px-7 pt-6 pb-5">
              <h2 id={`${dialogId}-title`} className="text-base font-semibold text-foreground">
                {label}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground max-w-prose">
                {description}
              </p>
            </div>

            <div className="px-7 py-5">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder={placeholder}
                rows={14}
                name={dialogId}
                aria-label={label}
                spellCheck
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <p className="mt-2 text-right text-xs tabular-nums text-muted-foreground">
                {draft.length.toLocaleString()} {draft.length === 1 ? 'character' : 'characters'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-7 py-4">
              <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleSave}>
                Done
              </Button>
            </div>
          </div>
        </dialog>,
        document.body,
      )}
    </>
  )
}
