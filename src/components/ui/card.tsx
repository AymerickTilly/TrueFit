import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 p-6', className)}>{children}</div>
  )
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-foreground',
        className
      )}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className, children }: CardProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
  )
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>
}

export function CardFooter({ className, children }: CardProps) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)}>{children}</div>
  )
}
