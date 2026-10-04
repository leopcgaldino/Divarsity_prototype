'use client'

import { createContext, useContext, ReactNode, useId } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component')
  }
  return context
}

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabListProps {
  children: ReactNode
  className?: string
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div 
      role="tablist" 
      className={cn('flex', className)} 
    >
      {children}
    </div>
  )
}

interface TabProps {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function Tab({ value, children, disabled, className }: TabProps) {
  const { value: currentValue, onValueChange } = useTabsContext()
  const isActive = currentValue === value
  const id = useId()
  const panelId = `${id}-panel`

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      id={id}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        isActive
          ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 shadow-sm'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      {children}
    </button>
  )
}

interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { value: currentValue } = useTabsContext()
  const isActive = currentValue === value
  const id = useId()
  const tabId = `${id}-tab`

  if (!isActive) return null

  return (
    <div
      role="tabpanel"
      aria-labelledby={tabId}
      id={id}
      className={cn('animate-in fade-in-0 duration-200', className)}
    >
      {children}
    </div>
  )
}