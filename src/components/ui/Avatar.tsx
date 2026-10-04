'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn, getInitials, generateAvatarColor } from '@/lib/utils'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'busy' | 'away'
  badge?: ReactNode
  verificationStatus?: 'pending' | 'verified' | 'rejected'
  prideBorder?: boolean
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-24 w-24 text-2xl',
}

const statusSizes = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
  '2xl': 'h-5 w-5',
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    src, 
    alt, 
    name, 
    size = 'md', 
    shape = 'circle', 
    status, 
    badge,
    verificationStatus,
    prideBorder = false,
    ...props 
  }, ref) => {
    const isCircle = shape === 'circle'
    const sizeClass = sizeClasses[size]
    const statusSizeClass = statusSizes[size]
    
    const statusColor = status ? statusColors[status] : ''
    
    const prideBorderClass = prideBorder 
      ? 'relative before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-pride-red before:via-pride-orange before:via-pride-yellow before:via-pride-green before:via-pride-blue before:to-pride-purple before:p-[2px] before:-z-10'
      : ''

    const verificationBadge = verificationStatus === 'verified' && (
      <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold shadow-lg border-2 border-white dark:border-gray-900">
        ✓
      </span>
    )

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden font-medium',
          'bg-gray-100 dark:bg-gray-800',
          isCircle ? 'rounded-full' : 'rounded-xl',
          sizeClass,
          prideBorderClass,
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : name ? (
          <span className={cn(sizeClass, 'flex items-center justify-center font-semibold text-white', generateAvatarColor(name))}>
            {getInitials(name)}
          </span>
        ) : (
          <svg
            className={cn(sizeClass, 'text-gray-400 dark:text-gray-500')}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        
        {verificationBadge}
        
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900',
              statusColor,
              statusSizeClass
            )}
            aria-label={`Status: ${status}`}
          />
        )}
        
        {badge && (
          <div className="absolute bottom-0 left-0">
            {badge}
          </div>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null
    alt?: string
    name?: string
    verificationStatus?: 'pending' | 'verified' | 'rejected'
  }>
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export function AvatarGroup({ avatars, max = 5, size = 'md', className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max)
  const remainingCount = avatars.length - max

  return (
    <div className={cn('flex -space-x-2', className)} aria-label={`${avatars.length} pessoas`}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          name={avatar.name}
          size={size}
          verificationStatus={avatar.verificationStatus}
          className="ring-2 ring-white dark:ring-gray-900"
        />
      ))}
      {remainingCount > 0 && (
        <Avatar
          name={`+${remainingCount}`}
          size={size}
          className="ring-2 ring-white dark:ring-gray-900 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        />
      )}
    </div>
  )
}