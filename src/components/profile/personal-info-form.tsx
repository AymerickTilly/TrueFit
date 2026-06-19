import { useState, type FormEvent } from 'react'
import { Button, Input, ExpandEditor } from '@/components/ui'
import type { Profile } from '@/types'

interface PersonalInfoFormProps {
  profile: Profile | null
  onSave: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

interface FormState {
  full_name:              string
  email:                  string
  phone:                  string
  location:               string
  linkedin_url:           string
  github_url:             string
  professional_statement: string
  personal_attributes:    string
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
  const [form, setForm]     = useState<FormState>(() => fromProfile(profile))
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

  function setField(key: keyof FormState) {
    return (val: string) => setForm(prev => ({ ...prev, [key]: val }))
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
        <Input label="Full name"  placeholder="Jane Smith"                       required {...field('full_name')} />
        <Input label="Email"      placeholder="jane@example.com"                 required type="email" {...field('email')} />
        <Input label="Phone"      placeholder="+64 21 000 0000"                  {...field('phone')} />
        <Input label="Location"   placeholder="Auckland, New Zealand"            {...field('location')} />
        <Input label="LinkedIn"   placeholder="https://linkedin.com/in/yourname" {...field('linkedin_url')} />
        <Input label="GitHub"     placeholder="https://github.com/yourname"      {...field('github_url')} />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Professional statement</label>
        <p className="text-xs text-muted-foreground">
          Keywords, a rough paragraph, or both. Never copied word for word — used as AI context only.
        </p>
        <ExpandEditor
          id="professional-statement"
          label="Professional statement"
          description="Write naturally: keywords, a rough paragraph, or both. The AI uses this as context and will never copy it word for word."
          value={form.professional_statement}
          onChange={setField('professional_statement')}
          placeholder="e.g. Junior dev, mostly backend, comfortable with Python and REST APIs. I like small teams where I can see the product impact."
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">Personal attributes</label>
        <p className="text-xs text-muted-foreground">
          Used verbatim in cover letters. Write in first person — who you are outside work and what it says about how you work.
        </p>
        <ExpandEditor
          id="personal-attributes"
          label="Personal attributes"
          description="Used verbatim in cover letters as a personal paragraph. Write in first person: who you are outside of work and what it says about how you work."
          value={form.personal_attributes}
          onChange={setField('personal_attributes')}
          placeholder="e.g. I bring a disciplined mindset to my work — consistent strength training keeps me focused, surfing keeps me balanced, time with friends and family keeps me grounded."
        />
      </div>

      {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="sm" loading={saving}>Save</Button>
        {saved && <span className="text-sm text-muted-foreground" role="status">Saved.</span>}
      </div>
    </form>
  )
}
