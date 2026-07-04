import { cn } from '@/lib/utils/cn'

export interface WizardStep {
  key: string
  label: string
  title: string
  description: string
}

interface ProfileStepperProps {
  steps: readonly WizardStep[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function ProfileStepper({ steps, activeIndex, onSelect }: ProfileStepperProps) {
  return (
    <nav aria-label="Profile sections" className="mb-6">
      {/* Desktop / tablet: labeled chips */}
      <ol className="hidden sm:flex flex-wrap items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === activeIndex
          return (
            <li key={step.key}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive
                    ? 'border-[1.5px] border-foreground bg-primary text-primary-foreground shadow-hard-sm'
                    : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80'
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]',
                    isActive ? 'bg-primary-foreground/25 text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                {step.label}
              </button>
            </li>
          )
        })}
      </ol>

      {/* Mobile: compact dots + current label */}
      <div className="flex sm:hidden flex-col gap-2">
        <p className="text-xs font-medium text-foreground">
          Step {activeIndex + 1} of {steps.length} · {steps[activeIndex].label}
        </p>
        <ol className="flex items-center gap-1.5">
          {steps.map((step, index) => (
            <li key={step.key} className="flex-1">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={index === activeIndex ? 'step' : undefined}
                aria-label={step.label}
                className={cn(
                  'block h-1.5 w-full rounded-full transition-colors duration-150',
                  index === activeIndex ? 'bg-primary' : 'bg-border'
                )}
              />
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
