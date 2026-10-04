'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, RadioGroup, Card } from '@/components/ui'
import { toastHelpers } from '@/components/ui/Toast'
import { AuthLayout } from '@/components/layout/MainLayout'
import { Logo } from '@/components/layout/Logo'
import { 
  UserIcon, 
  BuildingOfficeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp, signInWithGoogle } = useAuth()
  const redirect = searchParams.get('redirect') || '/onboarding'
  const planParam = searchParams.get('plan')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'talent' | 'company'>('talent')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!email) newErrors.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'E-mail inválido'
    if (!password) newErrors.password = 'Senha é obrigatória'
    else if (password.length < 8) newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Senhas não conferem'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const { error } = await signUp(email, password, role)
      if (error) throw error
      toastHelpers.success('Conta criada! Verifique seu e-mail para confirmar. 💜')
      router.push(`${redirect}?plan=${planParam || ''}`)
      router.refresh()
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (error) {
      toastHelpers.error('Erro ao cadastrar com Google')
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Logo size="lg" className="inline-flex mb-8" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Crie sua conta</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Junte-se à comunidade de talentos diversos mais acolhedora do Brasil
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" padding="lg">
            {/* Role Selection */}
            <RadioGroup
              label="Tipo de conta"
              name="role"
              value={role}
              onChange={(value) => setRole(value as 'talent' | 'company')}
              options={[
                { value: 'talent', label: 'Sou Talentos/Prestadora', description: 'Busco vagas, freelas ou bicos' },
                { value: 'company', label: 'Sou Empresa/Contratante', description: 'Quero anunciar oportunidades' },
              ]}
              orientation="vertical"
            />

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm" role="alert">
                  {errors.general}
                </div>
              )}

              <Input
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })) }}
                error={errors.email}
                placeholder="seu@email.com"
                leftIcon={<UserIcon className="h-5 w-5" />}
                autoComplete="email"
                required
              />

              <div className="relative">
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: undefined })) }}
                  error={errors.password}
                  placeholder="Mínimo 8 caracteres"
                  leftIcon={<ShieldCheckIcon className="h-5 w-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  }
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="relative">
                <Input
                  label="Confirmar Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined })) }}
                  error={errors.confirmPassword}
                  placeholder="Digite novamente"
                  leftIcon={<ShieldCheckIcon className="h-5 w-5" />}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <SparklesIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary-800 dark:text-primary-200">Proteção de dados garantida</h4>
                    <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
                      Seus dados são criptografados e protegidos pela LGPD. Nome social e pronomes ficam públicos; 
                      nome legal, CPF e documentos ficam privados, usados apenas para verificação de segurança.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Criar conta gratuita
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Ou cadastre-se com</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full gap-3" 
              onClick={handleGoogleSignUp} 
              disabled={isLoading}
              leftIcon={
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
            >
              Continuar com Google
            </Button>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Já tem conta?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Entre aqui
              </Link>
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Ao cadastrar-se, você concorda com nossos <Link href="/terms" className="text-primary-600 hover:underline">Termos de Uso</Link> e <Link href="/privacy" className="text-primary-600 hover:underline">Política de Privacidade</Link>.</p>
        </motion.div>
      </div>
    </AuthLayout>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>}>
      <RegisterPageContent />
    </Suspense>
  )
}
