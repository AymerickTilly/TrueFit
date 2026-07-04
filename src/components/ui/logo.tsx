import { cn } from '@/lib/utils/cn'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  withWordmark?: boolean
  className?: string
  markClassName?: string
  wordmarkClassName?: string
}

const MARK_SIZE: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-5 w-5',
  md: 'h-[26px] w-[26px]',
  lg: 'h-9 w-9',
}

const WORDMARK_SIZE: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export function Logo({ size = 'md', withWordmark = true, className, markClassName, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className={cn(MARK_SIZE[size], 'shrink-0', markClassName)}
      >
        <rect
          x="1.5" y="1.5" width="29" height="29" rx="9"
          fill="var(--primary)"
          stroke="var(--ink-shadow)"
          strokeWidth="1.75"
        />
        <path
          d="M9 17 L14 22 L23 10"
          fill="none"
          stroke="var(--primary-fg)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withWordmark && (
        <span
          className={cn('font-display font-semibold text-foreground select-none', WORDMARK_SIZE[size], wordmarkClassName)}
          translate="no"
        >
          TrueFit
        </span>
      )}
    </span>
  )
}
