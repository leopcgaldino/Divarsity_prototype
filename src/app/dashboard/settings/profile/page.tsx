'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useState } from 'react'
import { CameraIcon, UserIcon, EnvelopeIcon, LockClosedIcon, ShieldCheckIcon, MapPinIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { Avatar, Badge } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { toastHelpers } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { type Pronoun, type GenderIdentity, type SexualOrientation, type AvailabilityType } from '@/types'

const pronounOptions: Array<{ value: Pronoun; label: string }> = [
  { value: 'she_her', label: 'Ela/Dela' },
  { value: 'he_him', label: 'Ele/Dele' },
  { value: 'elu_delu', label: 'Elu/Delu' },
  { value: 'they_them', label: 'They/Them' },
  { value: 'custom', label: 'Personalizado' },
  { value: 'prefer_not_to_say', label: 'Prefiro não informar' },
]

const genderOptions: Array<{ value: GenderIdentity; label: string }> = [
  { value: 'cis_woman', label: 'Mulher Cisgênera' },
  { value: 'trans_woman', label: 'Mulher Transgênera' },
  { value: 'non_binary', label: 'Não-binário' },
  { value: 'genderfluid', label: 'Gênero Fluido' },
  { value: 'agender', label: 'Agênero' },
  { value: 'other', label: 'Outro' },
  { value: 'prefer_not_to_say', label: 'Prefiro não informar' },
]

const orientationOptions: Array<{ value: SexualOrientation; label: string }> = [
  { value: 'lesbian', label: 'Lésbica' },
  { value: 'bisexual', label: 'Bissexual' },
  { value: 'pansexual', label: 'Pansexual' },
  { value: 'asexual', label: 'Assexual' },
  { value: 'queer', label: 'Queer' },
  { value: 'heterosexual', label: 'Heterossexual' },
  { value: 'other', label: 'Outro' },
  { value: 'prefer_not_to_say', label: 'Prefiro não informar' },
]

const availabilityOptions: Array<{ value: AvailabilityType; label: string; description: string }> = [
  { value: 'formal', label: 'Emprego Formal (CLT/PJ)', description: 'Empregos CLT, PJ, Estágio, Trainee' },
  { value: 'freelance', label: 'Freelance/Projetos', description: 'Projetos por entrega, contratos temporários' },
  { value: 'gig', label: 'Bicos/Serviços Rápidos', description: 'Bicos, diárias, serviços rápidos presenciais' },
]

const states = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' }, { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' }, { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' }, { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' }, { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' }, { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' }, { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' }, { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' }, { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' }, { value: 'TO', label: 'Tocantins' },
]

export default function ProfileSettingsPage() {
  const { profile, user, refreshProfile } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<{
    social_name: string
    pronouns: Pronoun[]
    custom_pronouns: string
    gender_identity_new: GenderIdentity
    sexual_orientation_new: SexualOrientation
    show_identity_publicly: boolean
    headline: string
    bio: string
    location_city: string
    location_state: string
    location_neighborhood: string
    location_cep: string
    availability_types_arr: AvailabilityType[]
    is_open_to_work: boolean
    profile_visibility: boolean
    show_online_status: boolean
    allow_direct_messages: boolean
  }>({
    social_name: profile?.social_name || '',
    pronouns: (profile?.pronouns as Pronoun[]) || ['prefer_not_to_say'],
    custom_pronouns: profile?.custom_pronouns || '',
    gender_identity_new: (profile?.gender_identity_new as GenderIdentity) || 'prefer_not_to_say',
    sexual_orientation_new: (profile?.sexual_orientation_new as SexualOrientation) || 'prefer_not_to_say',
    show_identity_publicly: profile?.show_identity_publicly ?? true,
    headline: profile?.headline || '',
    bio: profile?.bio || '',
    location_city: profile?.location_city || '',
    location_state: profile?.location_state || '',
    location_neighborhood: profile?.location_neighborhood || '',
    location_cep: profile?.location_cep || '',
    availability_types_arr: (profile?.availability_types_arr as AvailabilityType[]) || ['formal'],
    is_open_to_work: profile?.is_open_to_work ?? true,
    profile_visibility: profile?.profile_visibility ?? true,
    show_online_status: profile?.show_online_status ?? true,
    allow_direct_messages: profile?.allow_direct_messages ?? true,
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastHelpers.error('Arquivo muito grande. Máximo 5MB.')
        return
      }
      if (!file.type.startsWith('image/')) {
        toastHelpers.error('Apenas imagens são permitidas.')
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    // TODO: Implementar save via API
    toastHelpers.success('Perfil salvo com sucesso! ✨')
  }

  const handleAvatarUpload = () => {
    // TODO: Implement upload to Supabase Storage
    toastHelpers.success('Foto atualizada! ✨')
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações do Perfil</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Gerencie suas informações de perfil e preferências</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Perfil Público</h2>
          </div>
          <div className="p-6 space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={avatarPreview}
                  name={formData.social_name}
                  size="2xl"
                  verificationStatus={profile?.verification_status}
                  prideBorder={profile?.verification_status === 'verified'}
                />
                <div className="absolute bottom-0 right-0">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => setAvatarPreview(e.target?.result as string)
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => (document.querySelector('input[type="file"]') as HTMLElement | null)?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
                      aria-label="Alterar foto"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.2A2 2 0 0115.077 5H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 01.586-1.414l3-3A2 2 0 0116 3h6a2 2 0 012 2v10.414l1 1a2 2 0 01-.586 1.414l-3 3A2 2 0 01-1.414.586H6a2 2 0 00-2 2v5.414l-1 1a2 2 0 00-.586 1.414l-3 3a2 2 0 00.586 1.414H16a2 2 0 01-2 2h-5v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 01.586-1.414l-3 3a2 2 0 00.586 1.414H16a2 2 0 01-2 2h-5v5a2 2 0 01-2-2v-5z" />
                      </svg>
                    </button>
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Foto do Perfil</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG ou WebP. Máx. 5MB.</p>
                </div>
              </div>
            </div>

            {/* Identidade */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Identidade
              </h3>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Social *</label>
                  <input
                    type="text"
                    value={formData.social_name}
                    onChange={(e) => setFormData({ ...formData, social_name: e.target.value })}
                    placeholder="Como você quer ser chamada"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pronomes *</label>
                  <div className="flex flex-wrap gap-2">
                    {pronounOptions.map(p => (
                      <label key={p.value} className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium border-2 cursor-pointer transition-all',
                        formData.pronouns.includes(p.value)
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600'
                      )}>
                        <input
                          type="checkbox"
                          checked={formData.pronouns.includes(p.value)}
                          onChange={(e) => {
                            const current = formData.pronouns
                            const next = e.target.checked
                              ? [...current, p.value]
                              : current.filter(v => v !== p.value)
                            setFormData({ ...formData, pronouns: next })
                          }}
                          className="sr-only"
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                  {formData.pronouns.includes('custom') && (
                    <input
                      type="text"
                      value={formData.custom_pronouns}
                      onChange={(e) => setFormData({ ...formData, custom_pronouns: e.target.value })}
                      placeholder="Seus pronomes personalizados"
                      className="w-full mt-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Identidade de Gênero</label>
                  <select
                    value={formData.gender_identity_new}
                    onChange={(e) => setFormData({ ...formData, gender_identity_new: e.target.value as GenderIdentity })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    {genderOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Orientação Sexual</label>
                  <select
                    value={formData.sexual_orientation_new}
                    onChange={(e) => setFormData({ ...formData, sexual_orientation_new: e.target.value as SexualOrientation })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    {orientationOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_identity_publicly}
                      onChange={(e) => setFormData({ ...formData, show_identity_publicly: e.target.checked })}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Exibir identidade e orientação no perfil público</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Perfil Profissional */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Perfil Profissional
              </h3>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título Profissional</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="Ex: Desenvolvedora Full Stack Sênior | React, Node, AWS"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Disponibilidade</label>
                  <div className="flex flex-wrap gap-2">
                    {availabilityOptions.map(opt => (
                      <label key={opt.value} className={cn(
                        'px-4 py-2 rounded-xl cursor-pointer transition-all border-2',
                        formData.availability_types_arr.includes(opt.value)
                          ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600'
                      )}>
                        <input
                          type="checkbox"
                          checked={formData.availability_types_arr.includes(opt.value)}
                          onChange={(e) => {
                            const current = formData.availability_types_arr
                            const next = e.target.checked
                              ? [...current, opt.value]
                              : current.filter(v => v !== opt.value)
                            setFormData({ ...formData, availability_types_arr: next })
                          }}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Conte sua história, experiências, o que te motiva..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Localização
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                <select
                  value={formData.location_state}
                  onChange={(e) => setFormData({ ...formData, location_state: e.target.value })}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Estado</option>
                  {states.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.location_city}
                  onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                  placeholder="Cidade"
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={formData.location_neighborhood}
                  onChange={(e) => setFormData({ ...formData, location_neighborhood: e.target.value })}
                  placeholder="Bairro"
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={formData.location_cep}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2')
                    setFormData({ ...formData, location_cep: v })
                  }}
                  placeholder="CEP"
                  maxLength={9}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Disponibilidade
              </h3>
              <div className="space-y-3">
                {availabilityOptions.map(opt => (
                  <label key={opt.value} className={cn(
                    'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2',
                    formData.availability_types_arr.includes(opt.value)
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  )}>
                    <input
                      type="checkbox"
                      checked={formData.availability_types_arr.includes(opt.value)}
                      onChange={(e) => {
                        const current = formData.availability_types_arr
                        const next = e.target.checked
                          ? [...current, opt.value]
                          : current.filter(v => v !== opt.value)
                        setFormData({ ...formData, availability_types_arr: next })
                      }}
                      className="h-5 w-5 text-primary-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{opt.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferências */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5" />
                Privacidade e Notificações
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Perfil Público</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Seu perfil pode ser encontrado por recrutadores</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.profile_visibility}
                    onChange={(e) => setFormData({ ...formData, profile_visibility: e.target.checked })}
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Mostrar Status Online</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Outras pessoas veem quando você está online</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.show_online_status}
                    onChange={(e) => setFormData({ ...formData, show_online_status: e.target.checked })}
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Permitir Mensagens Diretas</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Permitir que qualquer pessoa te envie mensagem</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.allow_direct_messages}
                    onChange={(e) => setFormData({ ...formData, allow_direct_messages: e.target.checked })}
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Aberto a Trabalhar</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Recrutadores verão que você está disponível</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_open_to_work}
                    onChange={(e) => setFormData({ ...formData, is_open_to_work: e.target.checked })}
                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={handleSave}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}



