import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { ProfileStepper, type WizardStep } from './profile-stepper'
import { PersonalInfoForm } from './personal-info-form'
import { SkillsSection } from './skills-section'
import { ExperienceSection } from './experience-section'
import { EducationSection } from './education-section'
import { ProjectSection } from './project-section'
import { VolunteeringSection } from './volunteering-section'
import { InterestsSection } from './interests-section'
import type { Profile } from '@/types'

const STEPS: readonly WizardStep[] = [
  { key: 'personal',     label: 'Personal info',   title: 'Personal info',    description: 'Your name, location, and contact details for your CV header.' },
  { key: 'skills',       label: 'Skills',          title: 'Skills',           description: 'Technologies, tools, and competencies matched against job requirements.' },
  { key: 'experience',   label: 'Work experience', title: 'Work experience',  description: 'Roles and responsibilities highlighted in generated CVs.' },
  { key: 'education',    label: 'Education',       title: 'Education',        description: 'Degrees, diplomas, and certifications.' },
  { key: 'projects',     label: 'Projects',        title: 'Projects',         description: 'Side projects, open source, or freelance work worth showcasing.' },
  { key: 'volunteering', label: 'Volunteering',    title: 'Volunteering',     description: 'Community work, mentoring, or industry involvement.' },
  { key: 'interests',    label: 'Interests',       title: 'Interests',        description: 'Personal interests that add dimension to your profile.' },
] as const

interface ProfileWizardProps {
  profile: Profile | null
  save: (updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<{ error: string | null }>
}

export function ProfileWizard({ profile, save }: ProfileWizardProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const stepParam    = searchParams.get('step')
  const foundIndex   = STEPS.findIndex(s => s.key === stepParam)
  const activeIndex  = foundIndex === -1 ? 0 : foundIndex
  const activeStep   = STEPS[activeIndex]

  function goToStep(index: number) {
    if (index < 0 || index >= STEPS.length) return
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.set('step', STEPS[index].key)
      return next
    }, { replace: true })
  }

  const showNameHint = activeIndex === 0 && !profile?.full_name

  function renderStep() {
    switch (activeStep.key) {
      case 'personal':
        return <PersonalInfoForm key={profile?.id ?? 'new'} profile={profile} onSave={save} />
      case 'skills':
        return <SkillsSection profileId={profile?.id} />
      case 'experience':
        return <ExperienceSection experience={profile?.work_experience ?? []} onSave={save} />
      case 'education':
        return <EducationSection education={profile?.education ?? []} onSave={save} />
      case 'projects':
        return <ProjectSection projects={profile?.projects ?? []} onSave={save} />
      case 'volunteering':
        return <VolunteeringSection volunteering={profile?.volunteering ?? []} onSave={save} />
      case 'interests':
        return <InterestsSection interests={profile?.interests ?? []} onSave={save} />
      default:
        return null
    }
  }

  return (
    <div>
      <ProfileStepper steps={STEPS} activeIndex={activeIndex} onSelect={goToStep} />

      <div key={activeStep.key} className="border-t border-border py-8 sm:py-12">
        <div className="mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground">{activeStep.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{activeStep.description}</p>
        </div>

        {renderStep()}

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={() => goToStep(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={14} aria-hidden="true" />
            Back
          </Button>

          <div className="flex flex-col items-end gap-1">
            {showNameHint && (
              <p className="text-xs text-muted-foreground">Add your name to continue — or skip ahead any time.</p>
            )}
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5"
              onClick={() => goToStep(activeIndex + 1)}
              disabled={activeIndex === STEPS.length - 1}
            >
              Next
              <ChevronRight size={14} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
