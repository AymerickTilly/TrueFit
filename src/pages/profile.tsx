import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { PersonalInfoForm } from '@/components/profile/personal-info-form'
import { Spinner } from '@/components/ui'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border py-8">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading, save } = useProfile()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {user?.email}
        </p>
      </div>

      <Section title="Personal info">
        <PersonalInfoForm key={profile?.id ?? 'new'} profile={profile} onSave={save} />
      </Section>

      <Section title="Skills">
        <p className="text-sm text-muted-foreground">Coming next.</p>
      </Section>

      <Section title="Work experience">
        <p className="text-sm text-muted-foreground">Coming next.</p>
      </Section>

      <Section title="Education">
        <p className="text-sm text-muted-foreground">Coming next.</p>
      </Section>

      <Section title="Projects">
        <p className="text-sm text-muted-foreground">Coming next.</p>
      </Section>
    </div>
  )
}
