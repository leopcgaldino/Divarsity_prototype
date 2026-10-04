import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  className?: string
  wordmarkClassName?: string
}

const sizes = {
  sm: { mark: 'h-8 w-8 text-base', word: 'text-lg' },
  md: { mark: 'h-9 w-9 text-lg', word: 'text-xl' },
  lg: { mark: 'h-11 w-11 text-xl', word: 'text-2xl' },
}

export function LogoMark({ size = 'md', className }: { size?: LogoProps['size']; className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-ink font-display font-extrabold text-white shadow-soft',
        sizes[size].mark,
        className
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-x-0 bottom-0 h-1.5 bg-pride-stripe" />
      <span className="relative -mt-0.5">D</span>
    </span>
  )
}

export function Logo({ href = '/', size = 'md', showWordmark = true, className, wordmarkClassName }: LogoProps) {
  return (
    <Link href={href} className={cn('flex items-center gap-2.5', className)} aria-label="Divarsity - Início">
      <LogoMark size={size} />
      {showWordmark && (
        <span className={cn('font-display font-bold tracking-tight text-ink dark:text-white', sizes[size].word, wordmarkClassName)}>
          Divarsity
        </span>
      )}
    </Link>
  )
}
