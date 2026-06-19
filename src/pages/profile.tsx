import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { PersonalInfoForm } from '@/components/profile/personal-info-form'
import { SkillsSection } from '@/components/profile/skills-section'
import { ExperienceSection } from '@/components/profile/experience-section'
import { EducationSection } from '@/components/profile/education-section'
import { ProjectSection } from '@/components/profile/project-section'
import { VolunteeringSection } from '@/components/profile/volunteering-section'
import { InterestsSection } from '@/components/profile/interests-section'
import { Spinner } from '@/components/ui'

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-card px-6 py-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading, save } = useProfile()

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'TF'

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-4">

      {/* Page header card */}
      <div className="rounded-2xl border border-border bg-card px-6 py-5 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white shadow-sm shadow-blue-200">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {profile?.full_name ?? 'Your profile'}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <Section title="Personal info">
        <PersonalInfoForm key={profile?.id ?? 'new'} profile={profile} onSave={save} />
      </Section>

      <Section title="Skills">
        <SkillsSection profileId={profile?.id} />
      </Section>

      <Section title="Work experience">
        <ExperienceSection experience={profile?.work_experience ?? []} onSave={save} />
      </Section>

      <Section title="Education">
        <EducationSection education={profile?.education ?? []} onSave={save} />
      </Section>

      <Section title="Projects">
        <ProjectSection projects={profile?.projects ?? []} onSave={save} />
      </Section>

      <Section title="Volunteering">
        <VolunteeringSection volunteering={profile?.volunteering ?? []} onSave={save} />
      </Section>

      <Section title="Interests">
        <InterestsSection interests={profile?.interests ?? []} onSave={save} />
      </Section>

    </div>
  )
}
