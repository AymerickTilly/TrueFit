import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { Spinner } from './spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={cn(
          // Base
          'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium transition-colors',
          // Focus ring — uses Tailwind's built-in zinc scale so opacity modifiers work
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-blue-700 transition-colors duration-150',
          variant === 'secondary' &&
            'border border-border bg-card text-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors duration-150',
          variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150',
          variant === 'destructive' &&
            'bg-red-500 text-white hover:bg-red-600 transition-colors duration-150',
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-9 px-4 text-sm',
          size === 'lg' && 'h-10 px-6 text-sm',
          className
        )}
        {...props}
      >
        {loading && <Spinner size="sm" className="shrink-0" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
