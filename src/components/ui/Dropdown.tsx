'use client'

import { Fragment, type ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface DropdownItem {
  label?: string
  onClick?: () => void
  href?: string
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: Array<DropdownItem>
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  return (
    <Menu as="div" className={cn('relative inline-block text-left', className)}>
      <Menu.Button as={Fragment}>
        {trigger}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className={cn(
          'absolute z-10 mt-2 min-w-[180px] rounded-xl bg-white dark:bg-gray-900',
          'shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10',
          'focus:outline-none',
          'py-1',
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          {items.map((item, index) => (
            item.divider ? (
              <div key={`divider-${index}`} className="border-t border-gray-200 dark:border-gray-700 my-1" role="separator" />
            ) : (
              <Menu.Item key={index}>
                {({ active }) => (
                  <>
                    {item.href ? (
                      <a
                        href={item.href}
                        onClick={item.onClick}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-sm',
                          'transition-colors duration-150',
                          item.disabled 
                            ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                            : 'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800',
                          active && !item.disabled 
                            ? 'bg-gray-100 dark:bg-gray-800' 
                            : '',
                          item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                        )}
                        aria-disabled={item.disabled}
                      >
                        {item.icon && <span className="flex-shrink-0 h-5 w-5">{item.icon}</span>}
                        {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-2.5 text-sm',
                          'transition-colors duration-150',
                          item.disabled 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800',
                          active && !item.disabled 
                            ? 'bg-gray-100 dark:bg-gray-800' 
                            : '',
                          item.danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                        )}
                        aria-disabled={item.disabled}
                      >
                        {item.icon && <span className="flex-shrink-0 h-5 w-5">{item.icon}</span>}
                        {item.label}
                      </button>
                    )}
                  </>
                )}
              </Menu.Item>
            )
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

interface SelectDropdownProps {
  label: string
  placeholder?: string
  options: Array<{ value: string; label: string; icon?: ReactNode; disabled?: boolean }>
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
  required?: boolean
}

export function SelectDropdown({ 
  label, 
  placeholder, 
  options, 
  value, 
  onChange, 
  error, 
  className,
  required 
}: SelectDropdownProps) {
  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
      </label>
      <Menu as="div" className="relative">
        <Menu.Button 
          className={cn(
            'w-full flex items-center justify-between rounded-xl border bg-white dark:bg-gray-900',
            'px-4 py-3 text-left text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          )}
        >
          <span className={cn('truncate', value ? '' : 'text-gray-400 dark:text-gray-500')}>
            {value ? selectedOption?.label : placeholder}
          </span>
          <ChevronDownIcon className={cn('h-5 w-5 text-gray-400 flex-shrink-0 ml-2', value && 'text-gray-600 dark:text-gray-400')} />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => !option.disabled && onChange(option.value)}
                    disabled={option.disabled}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm',
                      'transition-colors duration-150',
                      option.disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800',
                      active && !option.disabled 
                        ? 'bg-gray-100 dark:bg-gray-800' 
                        : '',
                      value === option.value ? 'font-medium text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                    )}
                    aria-disabled={option.disabled}
                    aria-selected={value === option.value}
                  >
                    {option.icon && <span className="flex-shrink-0 h-5 w-5">{option.icon}</span>}
                    {option.label}
                    {value === option.value && (
                      <svg className="ml-auto h-4 w-4 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
    </div>
  )
}