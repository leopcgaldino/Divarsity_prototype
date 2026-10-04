'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient, createUntypedClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { openChat } from '@/lib/chat/events'
import { Button, Card, Badge, Avatar, CardHeader, CardContent } from '@/components/ui'
import { MainLayout } from '@/components/layout/MainLayout'
import { 
  MapPinIcon, 
  BriefcaseIcon, 
  BuildingOfficeIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  SparklesIcon,
  ShieldCheckIcon,
  HeartIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  LinkIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { cn, formatRelativeTime } from '@/lib/utils'
import Image from 'next/image'
import { 
  type PublicProfile, 
  type Experience, 
  type Education,
  PRONOUN_LABELS,
  GENDER_IDENTITY_LABELS,
  SEXUAL_ORIENTATION_LABELS,
  AVAILABILITY_LABELS,
  WORK_MODALITY_LABELS,
  VERIFICATION_STATUS_LABELS,
  formatPronouns,
} from '@/types'

interface ProfilePageProps {
  params: { username: string }
}

const supabase = createClient()
const supabaseUntyped = createUntypedClient()

export default function PublicProfilePage({ params }: ProfilePageProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<PublicProfile & { 
    experiences?: Experience[]
    education?: Education[]
    skills?: string[]
    external_links?: Array<{label: string, url: string, icon: string}>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [params.username])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      // In real app, you'd query by username/slug
      // For now, we'll query by ID if it's a UUID
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          experiences:experiences (*),
          education:education (*),
          skills:profile_skills (skill_name)
        `)
        .or(`id.eq.${params.username},social_name.ilike.%${params.username}%`)
        .eq('profile_visibility', true)
        .single()

      if (error) throw error
      if (!data) throw new Error('Perfil não encontrado')
      
      setProfile(data as any)
    } catch {
      setError('Perfil não encontrado ou não é público')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!user) {
      router.push('/login?redirect=/u/' + params.username)
      return
    }
    // Create connection
    try {
      const { error } = await supabaseUntyped
        .from('connections')
        .insert({ requester_id: user.id, recipient_id: profile?.id, status: 'pending' })
      if (error) throw error
      toastHelpers.success('Pedido de conexão enviado! 🤝')
    } catch {
      toastHelpers.error('Erro ao enviar pedido')
    }
  }

  const handleMessage = () => {
    if (!user) {
      router.push('/login?redirect=/u/' + params.username)
      return
    }
    // Abre o widget de chat (canto inferior esquerdo) já na conversa com este perfil
    if (profile?.id) openChat({ profileId: profile.id })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
        </div>
      </MainLayout>
    )
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <SparklesIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Perfil não encontrado</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {error || 'Este perfil não existe ou não é público'}
            </p>
            <Button onClick={() => router.push('/')}>Voltar ao Início</Button>
          </motion.div>
        </div>
      </MainLayout>
    )
  }

  const { 
    social_name, 
    pronouns, 
    custom_pronouns,
    gender_identity_new, 
    sexual_orientation_new, 
    show_identity_publicly,
    headline, 
    bio, 
    location_city, 
    location_state,
    location_neighborhood,
    avatar_url, 
    cover_url,
    verification_status,
    availability_types_arr,
    is_open_to_work,
    experiences = [],
    education = [],
    skills = [],
    external_links = [],
    connections_count = 0,
    created_at,
  } = profile

  const displayPronouns = formatPronouns(pronouns, custom_pronouns)
  const hasLocation = location_city || location_state
  const fullLocation = [location_neighborhood, location_city, location_state].filter(Boolean).join(', ')

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover & Avatar */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          {cover_url && (
            <Image
              src={cover_url}
              alt="Capa do perfil"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          {!cover_url && (
            <div className="h-48 bg-gradient-to-r from-primary-500 via-purple-600 to-pride-purple" />
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950/90 via-gray-950/50 to-transparent dark:from-gray-900/90 dark:via-gray-900/50 dark:to-transparent">
            <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <Avatar 
                src={avatar_url} 
                name={social_name} 
                size="xl" 
                verificationStatus={verification_status}
                className="ring-4 ring-white dark:ring-gray-900 -mb-16"
              />
              <div className="flex-1 sm:ml-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{social_name}</h1>
                  {verification_status === 'verified' && (
                    <Badge variant="pride" className="flex items-center gap-1">
                      <ShieldCheckIcon className="h-4 w-4" />
                      Verificado
                    </Badge>
                  )}
                </div>
                
                {displayPronouns && (
                  <p className="mt-1 text-sm text-gray-300 flex items-center gap-2">
                    <span className="text-white font-medium">{displayPronouns}</span>
                    {gender_identity_new && show_identity_publicly && (
                      <>
                        <span className="text-gray-500">·</span>
                        <span>{GENDER_IDENTITY_LABELS[gender_identity_new]}</span>
                      </>
                    )}
                  </p>
                )}
                
                {headline && (
                  <p className="mt-2 text-lg text-gray-200 max-w-2xl">{headline}</p>
                )}
                
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                  {hasLocation && (
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {fullLocation}
                    </span>
                  )}
                  {is_open_to_work && (
                    <Badge variant="pride" size="sm" className="flex items-center gap-1">
                      <SparklesIcon className="h-3 w-3" />
                      Aberta a oportunidades
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:ml-auto">
                {user && user.id !== profile.id && (
                  <>
                    <Button variant="outline" onClick={handleConnect} leftIcon={<UserPlusIcon className="h-4 w-4" />}>
                      Conectar
                    </Button>
                    <Button variant="primary" onClick={handleMessage} leftIcon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}>
                      Mensagem
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {bio && (
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HeartIcon className="h-5 w-5 text-pride-pink" />
                  Sobre
                </h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{bio}</p>
              </Card>
            )}

            {/* Availability */}
            {availability_types_arr.length > 0 && (
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5" />
                  Modalidades de trabalho
                </h2>
                <div className="flex flex-wrap gap-2">
                  {availability_types_arr.map((type: keyof typeof AVAILABILITY_LABELS) => (
                    <Badge key={type} variant="outline" size="md">
                      {AVAILABILITY_LABELS[type]}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Experiences */}
            <Card variant="elevated" padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Experiências Profissionais
              </h2>
              
              {experiences.length > 0 ? (
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn('pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0', index === experiences.length - 1 && 'border-0')}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                          {exp.company && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <BuildingOfficeIcon className="h-3 w-3" />
                              {exp.company}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Badge variant="outline" size="sm">
                            {exp.work_modality ? WORK_MODALITY_LABELS[exp.work_modality] : 'Não informado'}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <CalendarDaysIcon className="h-3 w-3" />
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Atual' : exp.end_date ? formatDate(exp.end_date) : 'Não informado'}
                          </span>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{exp.description}</p>
                      )}
                      {(exp.location_city || exp.location_state) && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {[exp.location_city, exp.location_state].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BriefcaseIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma experiência profissional cadastrada</p>
                </div>
              )}
            </Card>

            {/* Education */}
            <Card variant="elevated" padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5" />
                Formação Acadêmica
              </h2>
              
              {education.length > 0 ? (
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn('pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0', index === education.length - 1 && 'border-0')}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{edu.institution}</h3>
                          {edu.degree && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{edu.degree}</p>
                          )}
                          {edu.field_of_study && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">{edu.field_of_study}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          {(edu.start_date || edu.end_date) && (
                            <span>
                              <CalendarDaysIcon className="h-3 w-3 inline" />
                              {edu.start_date ? formatDate(edu.start_date) : 'Início não informado'}
                              {edu.end_date && !edu.is_current ? ` - ${formatDate(edu.end_date)}` : edu.is_current ? ' - Atual' : ''}
                            </span>
                          )}
                          {edu.is_current && (
                            <Badge variant="primary" size="sm">Cursando</Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <AcademicCapIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma formação acadêmica cadastrada</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <Card variant="elevated" padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <SparklesIcon className="h-5 w-5" />
                Skills ({skills.length})
              </h2>
              
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge variant="outline" size="sm" className="cursor-default">
                        {skill}
                      </Badge>
                    </motion.span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <SparklesIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma skill cadastrada</p>
                </div>
              )}
            </Card>

            {/* Identity (if public) */}
            {(gender_identity_new || sexual_orientation_new) && show_identity_publicly && (
              <Card variant="outlined" padding="lg" className="border-pride-purple/30 bg-pride-purple/5 dark:bg-pride-purple/5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HeartIcon className="h-5 w-5 text-pride-pink" />
                  Identidade
                </h2>
                <div className="space-y-3">
                  {gender_identity_new && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Identidade de Gênero</p>
                      <p className="text-gray-900 dark:text-white">{GENDER_IDENTITY_LABELS[gender_identity_new]}</p>
                    </div>
                  )}
                  {sexual_orientation_new && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Orientação Sexual</p>
                      <p className="text-gray-900 dark:text-white">{SEXUAL_ORIENTATION_LABELS[sexual_orientation_new]}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Verification */}
            <Card variant="outlined" padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5" />
                Status de Verificação
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Documentos</span>
                  <Badge variant={verification_status === 'verified' ? 'success' : verification_status === 'pending' ? 'warning' : 'destructive'}>
                    {VERIFICATION_STATUS_LABELS[verification_status]}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* External Links */}
            {external_links.length > 0 && (
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <GlobeAltIcon className="h-5 w-5" />
                  Links
                </h2>
                <div className="space-y-2">
                  {external_links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white truncate">{link.label}</span>
                      <LinkIcon className="h-4 w-4 text-gray-300 ml-auto" />
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Member Since */}
            <Card variant="outlined" padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Membro desde</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Conexões</p>
                  <p className="text-gray-900 dark:text-white font-medium">{connections_count}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

import { toastHelpers } from '@/components/ui/Toast'