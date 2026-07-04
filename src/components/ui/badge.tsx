import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'outline'
  className?: string
  children: ReactNode
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:     'bg-primary text-primary-foreground',
  secondary:   'bg-secondary text-secondary-foreground',
  success:     'bg-success-bg text-success',
  destructive: 'bg-destructive/10 text-destructive',
  outline:     'border border-border text-foreground',
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
