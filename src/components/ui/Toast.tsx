'use client'

import { Toaster as SonnerToaster, type ToasterProps } from 'sonner'

export function Toaster(props?: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="system"
      toastOptions={{
        classNames: {
          toast: 'rounded-xl border bg-white dark:bg-gray-900 shadow-lg',
          description: 'text-gray-600 dark:text-gray-400',
          actionButton: 'bg-primary-600 hover:bg-primary-700',
          cancelButton: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
        },
      }}
      {...props}
    />
  )
}

// Toast helper functions
import { toast, type ToastT } from 'sonner'

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'promise'

interface CustomToastOptions {
  type?: ToastType
  [key: string]: any
}

export function showToast(message: string, options: CustomToastOptions = {}) {
  const { type = 'info', ...rest } = options
  
  const icons: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳',
    promise: '⏳',
  }

  return toast(message, {
    ...rest,
    icon: icons[type] || icons.info,
    style: {
      ...rest.style,
      backgroundColor: 'var(--sonner-toast-bg)',
      color: 'var(--sonner-toast-color)',
    },
  })
}

export const toastHelpers = {
  success: (message: string, options?: CustomToastOptions) => showToast(message, { ...options, type: 'success' }),
  error: (message: string, options?: CustomToastOptions) => showToast(message, { ...options, type: 'error' }),
  warning: (message: string, options?: CustomToastOptions) => showToast(message, { ...options, type: 'warning' }),
  info: (message: string, options?: CustomToastOptions) => showToast(message, { ...options, type: 'info' }),
  loading: (message: string, options?: CustomToastOptions) => showToast(message, { ...options, type: 'loading' }),
  promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string | ((data: T) => string); error: string | ((error: unknown) => string) }) => 
    toast.promise(promise, messages),
  dismiss: (toastId?: string | number) => toast.dismiss(toastId),
}