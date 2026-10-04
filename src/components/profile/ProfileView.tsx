'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  MapPinIcon, 
  BriefcaseIcon, 
  BuildingOfficeIcon, 
  GlobeAltIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  SparklesIcon,
  ShieldCheckIcon,
  HeartIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { 
  Avatar, 
  Badge, 
  Card, 
  Button,
} from '@/components/ui'
import { 
  type Profile, 
  type Experience, 
  type Education, 
  type ProfileSkill,
  PRONOUN_LABELS,
  GENDER_IDENTITY_LABELS,
  SEXUAL_ORIENTATION_LABELS,
  AVAILABILITY_LABELS,
  VERIFICATION_STATUS_LABELS,
  WORK_MODALITY_LABELS,
  formatPronouns,
  formatSalary,
} from '@/types'
import { cn, formatRelativeTime } from '@/lib/utils'

interface ProfileViewProps {
  profile: Profile & {
    experiences?: Experience[]
    education?: Education[]
    skills?: ProfileSkill[]
  }
}

const VERIFICATION_COLORS = {
  verified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export function ProfileView({ profile }: ProfileViewProps) {
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
    connections_count = 0,
    profile_views_count = 0,
    created_at,
  } = profile

  const displayPronouns = formatPronouns(pronouns, custom_pronouns)
  const hasLocation = location_city || location_state
  const fullLocation = [location_neighborhood, location_city, location_state].filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      {/* Cover & Avatar */}
      <div className="relative rounded-2xl overflow-hidden">
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
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-end gap-4">
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
                {verification_status === 'pending' && (
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                    Verificação pendente
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
            
            <div className="flex items-center gap-4 sm:ml-auto">
              <div className="hidden sm:flex items-center gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{profile_views_count}</p>
                  <p className="text-xs text-gray-400">Visualizações</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{connections_count}</p>
                  <p className="text-xs text-gray-400">Conexões</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{experiences.length}</p>
                  <p className="text-xs text-gray-400">Experiências</p>
                </div>
              </div>
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
                Sobre mim
              </h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{bio}</p>
            </Card>
          )}

          {/* Availability Types */}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Experiências Profissionais
              </h2>
              {experiences.length === 0 && (
                <span className="text-sm text-gray-500">Nenhuma experiência cadastrada</span>
              )}
            </div>
            
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
                          {formatRelativeTime(exp.start_date)} - {exp.is_current ? 'Atual' : formatRelativeTime(exp.end_date || '')}
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
                            {edu.start_date ? formatRelativeTime(edu.start_date) : 'Início não informado'}
                            {edu.end_date && !edu.is_current ? ` - ${formatRelativeTime(edu.end_date)}` : edu.is_current ? ' - Atual' : ''}
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
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge 
                      variant={skill.is_featured ? 'primary' : 'outline'} 
                      size="sm"
                      className="cursor-default"
                    >
                      {skill.skill_name}
                      {skill.is_featured && <span className="ml-1">⭐</span>}
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

          {/* Identity Info (if public) */}
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

          {/* Verification Status */}
          <Card variant="outlined" padding="lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5" />
              Status de Verificação
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Documentos</span>
                <Badge 
                  variant={verification_status === 'verified' ? 'success' : verification_status === 'pending' ? 'warning' : 'destructive'}
                  className={cn('capitalize', VERIFICATION_COLORS[verification_status])}
                >
                  {VERIFICATION_STATUS_LABELS[verification_status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Biometria</span>
                <Badge variant={profile.biometric_verified_at ? 'success' : 'outline'}>
                  {profile.biometric_verified_at ? 'Verificada' : 'Pendente'}
                </Badge>
              </div>
            </div>
            {(verification_status !== 'verified' || !profile.biometric_verified_at) && (
              <Button variant="outline" className="w-full mt-4" size="sm">
                Completar Verificação
              </Button>
            )}
          </Card>

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
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</p>
                <Badge variant="pride">Plus</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}