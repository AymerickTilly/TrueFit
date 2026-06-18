import { useState, type FormEvent } from 'react'
import { Button, Input } from '@/components/ui'
import type { Profile } from '@/types'

interface PersonalInfoFormProps {
  profile: Profile | null
  onSave: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

interface FormState {
  full_name: string
  email: string
  phone: string
  location: string
  linkedin_url: string
  github_url: string
  professional_statement: string
  personal_attributes: string
}

function fromProfile(profile: Profile | null): FormState {
  return {
    full_name:              profile?.full_name ?? '',
    email:                  profile?.email ?? '',
    phone:                  profile?.phone ?? '',
    location:               profile?.location ?? '',
    linkedin_url:           profile?.linkedin_url ?? '',
    github_url:             profile?.github_url ?? '',
    professional_statement: profile?.professional_statement ?? '',
    personal_attributes:    profile?.personal_attributes ?? '',
  }
}

export function PersonalInfoForm({ profile, onSave }: PersonalInfoFormProps) {
  const [form, setForm]   = useState<FormState>(() => fromProfile(profile))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState<string | null>(null)

  function field(key: keyof FormState) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [key]: e.target.value })),
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    setSaved(false)

    const { error } = await onSave(form)

    setSaving(false)
    if (error) {
      setError(error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full name"  placeholder="Jane Smith"            required {...field('full_name')} />
        <Input label="Email"      placeholder="jane@example.com"      required type="email" {...field('email')} />
        <Input label="Phone"      placeholder="+64 21 000 0000"          {...field('phone')} />
        <Input label="Location"   placeholder="Auckland, New Zealand"   {...field('location')} />
        <Input label="LinkedIn"   placeholder="https://linkedin.com/in/yourname" {...field('linkedin_url')} />
        <Input label="GitHub"     placeholder="https://github.com/yourname"      {...field('github_url')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Professional statement
        </label>
        <p className="text-xs text-muted-foreground">
          Write naturally: keywords, a rough paragraph, or both. The AI uses this as context and will never copy it word for word.
        </p>
        <textarea
          rows={4}
          placeholder="e.g. Junior dev, mostly backend, comfortable with Python and REST APIs. I like small teams where I can see the product impact."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          {...field('professional_statement')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Personal attributes
        </label>
        <p className="text-xs text-muted-foreground">
          Used verbatim in cover letters as a personal paragraph. Write in first person: who you are outside of work and what it says about how you work.
        </p>
        <textarea
          rows={4}
          placeholder="e.g. I bring a disciplined mindset to my work, something I also apply in my personal life. Consistent strength training keeps me focused, surfing keeps me balanced, and time with friends and family keeps me grounded."
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          {...field('personal_attributes')}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="sm" loading={saving}>
          Save
        </Button>
        {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
      </div>
    </form>
  )
}
