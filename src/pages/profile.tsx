import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { useReveal } from '@/hooks/use-reveal'
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
  description: string
  children: React.ReactNode
}

function Section({ title, description, children }: SectionProps) {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} data-reveal className="flex gap-10 border-t border-border py-10">
      <div className="w-44 shrink-0 pt-0.5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
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
      <div className="mb-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <Section title="Personal info" description="Your name, location, and contact details for your CV header.">
        <PersonalInfoForm key={profile?.id ?? 'new'} profile={profile} onSave={save} />
      </Section>

      <Section title="Skills" description="Technologies, tools, and competencies matched against job requirements.">
        <SkillsSection profileId={profile?.id} />
      </Section>

      <Section title="Work experience" description="Roles and responsibilities highlighted in generated CVs.">
        <ExperienceSection experience={profile?.work_experience ?? []} onSave={save} />
      </Section>

      <Section title="Education" description="Degrees, diplomas, and certifications.">
        <EducationSection education={profile?.education ?? []} onSave={save} />
      </Section>

      <Section title="Projects" description="Side projects, open source, or freelance work worth showcasing.">
        <ProjectSection projects={profile?.projects ?? []} onSave={save} />
      </Section>

      <Section title="Volunteering" description="Community work, mentoring, or industry involvement.">
        <VolunteeringSection volunteering={profile?.volunteering ?? []} onSave={save} />
      </Section>

      <Section title="Interests" description="Personal interests that add dimension to your profile.">
        <InterestsSection interests={profile?.interests ?? []} onSave={save} />
      </Section>
    </div>
  )
}
