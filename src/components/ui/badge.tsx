import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'outline'
  className?: string
  children: ReactNode
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:     'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900',
  secondary:   'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  success:     'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  destructive: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
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
