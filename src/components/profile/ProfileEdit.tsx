'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { 
  Button, 
  Input, 
  Textarea, 
  Select, 
  Checkbox, 
  RadioGroup, 
  Card, 
  Badge, 
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from '@/components/ui'
import { 
  type Profile, 
  type Experience, 
  type Education, 
  type ProfileSkill,
  type Pronoun,
  type GenderIdentity,
  type SexualOrientation,
  type AvailabilityType,
  type CommonSkill,
  PRONOUN_LABELS,
  GENDER_IDENTITY_LABELS,
  SEXUAL_ORIENTATION_LABELS,
  AVAILABILITY_LABELS,
  WORK_MODALITY_LABELS,
  commonSkills,
} from '@/types'
import { cn } from '@/lib/utils'
import { toastHelpers } from '@/components/ui/Toast'
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CameraIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'

const supabase = createClient()

const pronounOptions: Array<{ value: Pronoun; label: string }> = [
  { value: 'she_her', label: PRONOUN_LABELS.she_her },
  { value: 'he_him', label: PRONOUN_LABELS.he_him },
  { value: 'elu_delu', label: PRONOUN_LABELS.elu_delu },
  { value: 'they_them', label: PRONOUN_LABELS.they_them },
  { value: 'custom', label: PRONOUN_LABELS.custom },
  { value: 'prefer_not_to_say', label: PRONOUN_LABELS.prefer_not_to_say },
]

const genderIdentityOptions: Array<{ value: GenderIdentity; label: string }> = [
  { value: 'cis_woman', label: GENDER_IDENTITY_LABELS.cis_woman },
  { value: 'trans_woman', label: GENDER_IDENTITY_LABELS.trans_woman },
  { value: 'non_binary', label: GENDER_IDENTITY_LABELS.non_binary },
  { value: 'genderfluid', label: GENDER_IDENTITY_LABELS.genderfluid },
  { value: 'agender', label: GENDER_IDENTITY_LABELS.agender },
  { value: 'other', label: GENDER_IDENTITY_LABELS.other },
  { value: 'prefer_not_to_say', label: GENDER_IDENTITY_LABELS.prefer_not_to_say },
]

const sexualOrientationOptions: Array<{ value: SexualOrientation; label: string }> = [
  { value: 'lesbian', label: SEXUAL_ORIENTATION_LABELS.lesbian },
  { value: 'bisexual', label: SEXUAL_ORIENTATION_LABELS.bisexual },
  { value: 'pansexual', label: SEXUAL_ORIENTATION_LABELS.pansexual },
  { value: 'asexual', label: SEXUAL_ORIENTATION_LABELS.asexual },
  { value: 'queer', label: SEXUAL_ORIENTATION_LABELS.queer },
  { value: 'heterosexual', label: SEXUAL_ORIENTATION_LABELS.heterosexual },
  { value: 'other', label: SEXUAL_ORIENTATION_LABELS.other },
  { value: 'prefer_not_to_say', label: SEXUAL_ORIENTATION_LABELS.prefer_not_to_say },
]

const availabilityOptions: Array<{ value: AvailabilityType; label: string }> = [
  { value: 'formal', label: AVAILABILITY_LABELS.formal },
  { value: 'freelance', label: AVAILABILITY_LABELS.freelance },
  { value: 'gig', label: AVAILABILITY_LABELS.gig },
]

const workModalityOptions = [
  { value: 'remote', label: WORK_MODALITY_LABELS.remote },
  { value: 'hybrid', label: WORK_MODALITY_LABELS.hybrid },
  { value: 'onsite', label: WORK_MODALITY_LABELS.onsite },
]

interface ProfileEditProps {
  profile: Profile & {
    experiences?: Experience[]
    education?: Education[]
    skills?: ProfileSkill[]
  }
  onSave: (data: Partial<Profile>) => void
  onAddExperience: (exp: Omit<Experience, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => void
  onUpdateExperience: (id: string, updates: Partial<Experience>) => void
  onDeleteExperience: (id: string) => void
  onAddEducation: (edu: Omit<Education, 'id' | 'profile_id' | 'created_at'>) => void
  onUpdateEducation: (id: string, updates: Partial<Education>) => void
  onDeleteEducation: (id: string) => void
  onUpdateSkills: (skills: string[]) => void
}

export function ProfileEdit({ 
  profile, 
  onSave, 
  onAddExperience, 
  onUpdateExperience, 
  onDeleteExperience,
  onAddEducation,
  onUpdateEducation,
  onDeleteEducation,
  onUpdateSkills,
}: ProfileEditProps) {
  const [activeTab, setActiveTab] = useState<'identity' | 'professional' | 'experience' | 'skills' | 'settings'>('identity')
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    social_name: profile.social_name || '',
    pronouns: profile.pronouns || ['prefer_not_to_say'] as Pronoun[],
    custom_pronouns: profile.custom_pronouns || '',
    gender_identity: profile.gender_identity_new || 'prefer_not_to_say' as GenderIdentity,
    sexual_orientation: profile.sexual_orientation_new || 'prefer_not_to_say' as SexualOrientation,
    show_identity_publicly: profile.show_identity_publicly ?? true,
    headline: profile.headline || '',
    bio: profile.bio || '',
    location_city: profile.location_city || '',
    location_state: profile.location_state || '',
    location_neighborhood: profile.location_neighborhood || '',
    location_cep: profile.location_cep || '',
    availability_types_arr: profile.availability_types_arr || ['formal'] as AvailabilityType[],
    is_open_to_work: profile.is_open_to_work ?? true,
    profile_visibility: profile.profile_visibility ?? true,
    show_online_status: profile.show_online_status ?? true,
    allow_direct_messages: profile.allow_direct_messages ?? true,
  })

  const [experiences, setExperiences] = useState<Experience[]>(profile.experiences || [])
  const [education, setEducation] = useState<Education[]>(profile.education || [])
  const [skills, setSkills] = useState<string[]>(profile.skills?.map(s => s.skill_name) || [])
  const [customSkillInput, setCustomSkillInput] = useState('')
  
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null)
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url || null)
  const [coverPreview, setCoverPreview] = useState<string | null>(profile.cover_url || null)

  // Update form data helper
  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePronoun = (pronoun: Pronoun) => {
    setFormData(prev => {
      const current = prev.pronouns
      const next = current.includes(pronoun)
        ? current.filter(p => p !== pronoun)
        : [...current, pronoun]
      if (next.length === 0) return prev
      return { ...prev, pronouns: next }
    })
  }

  const toggleAvailability = (type: AvailabilityType) => {
    setFormData(prev => {
      const current = prev.availability_types_arr
      const next = current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type]
      if (next.length === 0) return prev
      return { ...prev, availability_types_arr: next }
    })
  }

  const toggleSkill = (skill: string) => {
    setSkills(prev => {
      const next = prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
      return next
    })
  }

  const handleCustomSkillAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      const skill = customSkillInput.trim()
      if (!skills.includes(skill) && !commonSkills.includes(skill as CommonSkill)) {
        toggleSkill(skill)
      }
      setCustomSkillInput('')
    }
  }

  const handleImageUpload = async (type: 'avatar' | 'cover', file: File) => {
    if (!file.type.startsWith('image/')) {
      toastHelpers.error('Apenas arquivos de imagem são permitidos')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toastHelpers.error('Imagem deve ter no máximo 5MB')
      return
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })
      
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      const publicUrl = data.publicUrl

      if (type === 'avatar') {
        setAvatarPreview(publicUrl)
      } else {
        setCoverPreview(publicUrl)
      }

      toastHelpers.success(`${type === 'avatar' ? 'Avatar' : 'Capa'} atualizada!`)
    } catch (error) {
      toastHelpers.error('Erro ao fazer upload da imagem')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Include avatar/cover URLs if they changed
      const saveData: Partial<Profile> = {
        ...formData,
        avatar_url: avatarPreview !== profile.avatar_url ? avatarPreview : undefined,
        cover_url: coverPreview !== profile.cover_url ? coverPreview : undefined,
      }
      onSave(saveData)
    } finally {
      setSaving(false)
    }
  }

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: `temp-${Date.now()}`,
      profile_id: '',
      title: '',
      company: '',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      is_current: false,
      work_modality: 'remote',
      location_city: '',
      location_state: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setExperiences(prev => [...prev, newExp])
    setEditingExperienceId(newExp.id)
  }

  const saveExperience = (exp: Experience) => {
    if (exp.id.startsWith('temp-')) {
      onAddExperience({
        title: exp.title,
        company: exp.company || null,
        description: exp.description || null,
        start_date: exp.start_date,
        end_date: exp.end_date || null,
        is_current: exp.is_current,
        work_modality: exp.work_modality || 'remote',
        location_city: exp.location_city || null,
        location_state: exp.location_state || null,
      })
    } else {
      onUpdateExperience(exp.id, exp)
    }
    setEditingExperienceId(null)
  }

  const deleteExperience = (id: string) => {
    if (id.startsWith('temp-')) {
      setExperiences(prev => prev.filter(e => e.id !== id))
    } else {
      onDeleteExperience(id)
    }
  }

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: `temp-${Date.now()}`,
      profile_id: '',
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      created_at: new Date().toISOString(),
    }
    setEducation(prev => [...prev, newEdu])
    setEditingEducationId(newEdu.id)
  }

  const saveEducation = (edu: Education) => {
    if (edu.id.startsWith('temp-')) {
      onAddEducation({
        institution: edu.institution,
        degree: edu.degree || null,
        field_of_study: edu.field_of_study || null,
        start_date: edu.start_date || null,
        end_date: edu.end_date || null,
        is_current: edu.is_current,
      })
    } else {
      onUpdateEducation(edu.id, edu)
    }
    setEditingEducationId(null)
  }

  const deleteEducation = (id: string) => {
    if (id.startsWith('temp-')) {
      setEducation(prev => prev.filter(e => e.id !== id))
    } else {
      onDeleteEducation(id)
    }
  }

  // Sync skills to parent on change
  useEffect(() => {
    onUpdateSkills(skills)
  }, [skills, onUpdateSkills])

  return (
    <div className="space-y-6">
      {/* Avatar & Cover */}
      <Card variant="elevated" padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <CameraIcon className="h-5 w-5" />
          Foto de Perfil e Capa
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Preview do avatar"
                    width={80}
                    height={80}
                    className="rounded-full object-cover ring-2 ring-primary-500"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {formData.social_name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload('avatar', e.target.files[0])}
                  />
                  <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm hover:bg-primary-700 transition-colors">
                    <CameraIcon className="h-4 w-4" />
                  </div>
                </label>
              </div>
              <p className="text-sm text-gray-500">JPG/PNG até 5MB. Recomendado 400x400px.</p>
            </div>
          </div>

          {/* Cover */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Foto de Capa
            </label>
            <div className="relative">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt="Preview da capa"
                  width={300}
                  height={100}
                  className="rounded-xl object-cover w-full"
                />
              ) : (
                <div className="h-24 w-full rounded-xl bg-gradient-to-r from-primary-500 via-purple-600 to-pride-purple" />
              )}
              <label className="absolute bottom-2 right-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload('cover', e.target.files[0])}
                />
                <Button variant="outline" size="sm" className="gap-1">
                  <CameraIcon className="h-4 w-4" />
                  Alterar
                </Button>
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">Proporção recomendada 3:1 (1200x400px).</p>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="space-y-6">
        <TabList className="grid grid-cols-5 gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <Tab value="identity" className="text-sm">
            <ShieldCheckIcon className="h-4 w-4 mr-1" /> Identidade
          </Tab>
          <Tab value="professional" className="text-sm">
            <BriefcaseIcon className="h-4 w-4 mr-1" /> Profissional
          </Tab>
          <Tab value="experience" className="text-sm">
            <SparklesIcon className="h-4 w-4 mr-1" /> Experiências
          </Tab>
          <Tab value="skills" className="text-sm">
            <AcademicCapIcon className="h-4 w-4 mr-1" /> Skills
          </Tab>
          <Tab value="settings" className="text-sm">
            <MapPinIcon className="h-4 w-4 mr-1" /> Configurações
          </Tab>
        </TabList>

        {/* Identity Tab */}
        <TabPanel value="identity">
          <AnimatePresence mode="wait">
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Informações Públicas</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Estas informações aparecem no seu perfil público. Nome legal, CPF e data de nascimento ficam privados.
                </p>

                <Input
                  label="Nome Social *"
                  value={formData.social_name}
                  onChange={(e) => updateField('social_name', e.target.value)}
                  placeholder="Como você quer ser chamada"
                  required
                  autoComplete="name"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pronomes * <span className="text-primary-600">(múltipla escolha)</span>
                  </label>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Pronomes">
                    {pronounOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => togglePronoun(option.value)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium border-2 transition-all',
                          formData.pronouns.includes(option.value)
                            ? 'bg-primary-600 border-primary-600 text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600'
                        )}
                        aria-pressed={formData.pronouns.includes(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {formData.pronouns.includes('custom') && (
                    <Input
                      label="Pronomes Personalizados"
                      value={formData.custom_pronouns}
                      onChange={(e) => updateField('custom_pronouns', e.target.value)}
                      placeholder="Ex: ela/elu, ele/delu..."
                      className="mt-3"
                    />
                  )}
                </div>

                <Select
                  label="Identidade de Gênero"
                  options={genderIdentityOptions}
                  value={formData.gender_identity}
                  onChange={(value) => updateField('gender_identity', value as unknown as GenderIdentity)}
                  placeholder="Selecione..."
                />

                <Select
                  label="Orientação Sexual"
                  options={sexualOrientationOptions}
                  value={formData.sexual_orientation}
                  onChange={(value) => updateField('sexual_orientation', value as unknown as SexualOrientation)}
                  placeholder="Selecione..."
                />

                <Checkbox
                  label="Exibir minha identidade e orientação no perfil público"
                  description="Outras pessoas poderão ver sua identidade de gênero e orientação sexual"
                  checked={formData.show_identity_publicly}
                  onChange={(e) => updateField('show_identity_publicly', e.target.checked)}
                />
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabPanel>

        {/* Professional Tab */}
        <TabPanel value="professional">
          <AnimatePresence mode="wait">
            <motion.div
              key="professional"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Perfil Profissional</h3>

                <Input
                  label="Título Profissional *"
                  value={formData.headline}
                  onChange={(e) => updateField('headline', e.target.value)}
                  placeholder="Ex: Desenvolvedora Frontend Sênior | Designer UX | Eletricista"
                  required
                />

                <Textarea
                  label="Bio / Sobre mim"
                  value={formData.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Conte sua história, experiências, o que te motiva... (máx. 500 caracteres)"
                  maxLength={500}
                  rows={4}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Modalidade preferida"
                    options={workModalityOptions}
                    value={formData.availability_types_arr[0] || 'remote'}
                    onChange={(value) => updateField('availability_types_arr', [value as unknown as AvailabilityType])}
                    placeholder="Selecione..."
                  />
                </div>
              </Card>

              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Cidade"
                    value={formData.location_city}
                    onChange={(e) => updateField('location_city', e.target.value)}
                    placeholder="São Paulo"
                  />
                  <Select
                    label="Estado"
                    options={[
                      { value: '', label: 'Selecione...' },
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
                    ]}
                    value={formData.location_state}
                    onChange={(value) => updateField('location_state', value)}
                    placeholder="Selecione..."
                  />
                  <Input
                    label="Bairro"
                    value={formData.location_neighborhood}
                    onChange={(e) => updateField('location_neighborhood', e.target.value)}
                    placeholder="Centro, Vila Madalena..."
                  />
                  <Input
                    label="CEP"
                    value={formData.location_cep}
                    onChange={(e) => updateField('location_cep', e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2'))}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>
              </Card>

              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5" />
                  Disponibilidade
                </h3>
                <div className="space-y-3">
                  {availabilityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                        formData.availability_types_arr.includes(option.value)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={formData.availability_types_arr.includes(option.value)}
                        onChange={() => toggleAvailability(option.value)}
                        className="h-5 w-5 text-primary-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabPanel>

        {/* Experiences Tab */}
        <TabPanel value="experience">
          <AnimatePresence mode="wait">
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5" />
                  Experiências Profissionais
                </h3>
                {editingExperienceId === null && experiences.length < 10 && (
                  <Button variant="outline" size="sm" onClick={addExperience} leftIcon={<PlusIcon className="h-4 w-4" />}>
                    Adicionar
                  </Button>
                )}
              </div>

              {experiences.length === 0 && (
                <Card variant="outlined" padding="lg" className="text-center">
                  <BriefcaseIcon className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma experiência cadastrada</p>
                  <Button variant="primary" className="mt-4" onClick={addExperience} leftIcon={<PlusIcon className="h-4 w-4" />}>
                    Adicionar primeira experiência
                  </Button>
                </Card>
              )}

              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <AnimatePresence key={exp.id}>
                    {editingExperienceId === exp.id ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <ExperienceForm
                          experience={exp}
                          onSave={(data) => saveExperience({ ...exp, ...data })}
                          onCancel={() => setEditingExperienceId(null)}
                          onDelete={() => deleteExperience(exp.id)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <ExperienceCard
                          experience={exp}
                          onEdit={() => setEditingExperienceId(exp.id)}
                          onDelete={() => deleteExperience(exp.id)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </TabPanel>

        {/* Skills Tab */}
        <TabPanel value="skills">
          <AnimatePresence mode="wait">
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5" />
                  Skills e Competências
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Clique nas skills abaixo para adicionar/remover. Suas 3 primeiras skills ficam em destaque no perfil.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {commonSkills.map(skill => (
                    <Badge
                      key={skill}
                      variant={skills.includes(skill) ? 'primary' : 'outline'}
                      size="sm"
                      removable
                      onRemove={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.filter(s => !commonSkills.includes(s as CommonSkill)).map(skill => (
                    <Badge
                      key={skill}
                      variant="primary"
                      size="sm"
                      removable
                      onRemove={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                  <Input
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={handleCustomSkillAdd}
                    placeholder="Adicionar skill personalizada (Enter para adicionar)"
                    className="w-auto min-w-[200px]"
                  />
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value="settings">
          <AnimatePresence mode="wait">
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Privacidade e Visibilidade</h3>
                <div className="space-y-4">
                  <Checkbox
                    label="Perfil público"
                    description="Permitir que seu perfil apareça nas buscas e seja acessível via link direto"
                    checked={formData.profile_visibility}
                    onChange={(e) => updateField('profile_visibility', e.target.checked)}
                  />
                  <Checkbox
                    label="Mostrar status online"
                    description="Mostrar quando você está online para outras pessoas"
                    checked={formData.show_online_status}
                    onChange={(e) => updateField('show_online_status', e.target.checked)}
                  />
                  <Checkbox
                    label="Permitir mensagens diretas"
                    description="Permitir que qualquer pessoa inicie uma conversa com você"
                    checked={formData.allow_direct_messages}
                    onChange={(e) => updateField('allow_direct_messages', e.target.checked)}
                  />
                  <Checkbox
                    label="Aberta a oportunidades"
                    description="Empresas e recrutadores verão que você está disponível"
                    checked={formData.is_open_to_work}
                    onChange={(e) => updateField('is_open_to_work', e.target.checked)}
                  />
                </div>
              </Card>

              <Card variant="outlined" padding="lg" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Zona de Perigo
                </h3>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  Ações irreversíveis. Use com cuidado.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="destructive" className="flex-1">
                    Excluir Conta
                  </Button>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabPanel>
      </Tabs>

      {/* Save Button - Fixed at bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 p-4 lg:static lg:border-0 lg:bg-transparent lg:p-0">
        <div className="mx-auto max-w-5xl flex justify-end gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={saving}
            rightIcon={<SparklesIcon className="h-4 w-4" />}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Experience Card Component
function ExperienceCard({ experience, onEdit, onDelete }: { 
  experience: Experience
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card variant="outlined" padding="md" className="relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">{experience.title}</h4>
          {experience.company && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <BuildingOfficeIcon className="h-3 w-3" />
              {experience.company}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <Badge variant="outline" size="sm">
              {experience.work_modality ? WORK_MODALITY_LABELS[experience.work_modality] : 'Não informado'}
            </Badge>
            <span className="flex items-center gap-1">
              <CalendarDaysIcon className="h-3 w-3" />
              {new Date(experience.start_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
              {' - '}
              {experience.is_current ? 'Atual' : experience.end_date ? new Date(experience.end_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : 'Não informado'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Editar experiência">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Excluir experiência" className="text-red-600 hover:text-red-700">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Experience Form Component
function ExperienceForm({ experience, onSave, onCancel, onDelete }: { 
  experience: Experience
  onSave: (data: Partial<Experience>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [formData, setFormData] = useState({
    title: experience.title,
    company: experience.company || '',
    description: experience.description || '',
    start_date: experience.start_date,
    end_date: experience.end_date || '',
    is_current: experience.is_current,
    work_modality: experience.work_modality || 'remote',
    location_city: experience.location_city || '',
    location_state: experience.location_state || '',
  })

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toastHelpers.error('Título é obrigatório')
      return
    }
    onSave(formData)
  }

  return (
    <Card variant="elevated" padding="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Editar Experiência</h4>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cargo *"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Ex: Desenvolvedora Full Stack"
            required
          />
          <Input
            label="Empresa"
            value={formData.company}
            onChange={(e) => updateField('company', e.target.value)}
            placeholder="Nome da empresa"
          />
          <Select
            label="Modalidade"
            options={workModalityOptions}
            value={formData.work_modality}
            onChange={(value) => updateField('work_modality', value as 'remote' | 'hybrid' | 'onsite')}
            placeholder="Selecione..."
          />
          <Input
            label="Início *"
            type="date"
            value={formData.start_date}
            onChange={(e) => updateField('start_date', e.target.value)}
            required
          />
          <Input
            label="Fim"
            type="date"
            value={formData.end_date}
            onChange={(e) => updateField('end_date', e.target.value)}
            disabled={formData.is_current}
          />
          <Checkbox
            label="Atual"
            checked={formData.is_current}
            onChange={(e) => updateField('is_current', e.target.checked)}
          />
        </div>

        <Input
          label="Cidade"
          value={formData.location_city}
          onChange={(e) => updateField('location_city', e.target.value)}
          placeholder="São Paulo"
        />
        <Select
          label="Estado"
          options={[
            { value: '', label: 'Selecione...' },
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
          ]}
          value={formData.location_state}
          onChange={(value) => updateField('location_state', value)}
          placeholder="Selecione..."
        />

        <Textarea
          label="Descrição"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Principais responsabilidades e conquistas..."
          rows={3}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          {!experience.id.startsWith('temp-') && (
            <Button type="button" variant="destructive" onClick={onDelete}>
              <TrashIcon className="h-4 w-4" />
              Excluir
            </Button>
          )}
          <Button type="submit" variant="primary" rightIcon={<PlusIcon className="h-4 w-4" />}>
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  )
}

// Education Card Component
function EducationCard({ education, onEdit, onDelete }: { 
  education: Education
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card variant="outlined" padding="md" className="relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">{education.institution}</h4>
          {education.degree && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{education.degree}</p>
          )}
          {education.field_of_study && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{education.field_of_study}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            {(education.start_date || education.end_date) && (
              <span className="flex items-center gap-1">
                <CalendarDaysIcon className="h-3 w-3" />
                {education.start_date ? new Date(education.start_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : 'Início não informado'}
                {education.end_date && !education.is_current ? ` - ${new Date(education.end_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}` : education.is_current ? ' - Atual' : ''}
              </span>
            )}
            {education.is_current && (
              <Badge variant="primary" size="sm">Cursando</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Editar formação">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Excluir formação" className="text-red-600 hover:text-red-700">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// Education Form Component
function EducationForm({ education, onSave, onCancel, onDelete }: { 
  education: Education
  onSave: (data: Partial<Education>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [formData, setFormData] = useState({
    institution: education.institution,
    degree: education.degree || '',
    field_of_study: education.field_of_study || '',
    start_date: education.start_date || '',
    end_date: education.end_date || '',
    is_current: education.is_current,
  })

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.institution.trim()) {
      toastHelpers.error('Instituição é obrigatória')
      return
    }
    onSave(formData)
  }

  return (
    <Card variant="elevated" padding="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Editar Formação</h4>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Instituição *"
            value={formData.institution}
            onChange={(e) => updateField('institution', e.target.value)}
            placeholder="Ex: USP, PUC, Coursera..."
            required
          />
          <Input
            label="Curso/Grau"
            value={formData.degree}
            onChange={(e) => updateField('degree', e.target.value)}
            placeholder="Ex: Bacharelado, Pós-graduação, Curso Livre"
          />
          <Input
            label="Área de Estudo"
            value={formData.field_of_study}
            onChange={(e) => updateField('field_of_study', e.target.value)}
            placeholder="Ex: Ciência da Computação, Design, Administração"
          />
          <Input
            label="Início"
            type="date"
            value={formData.start_date}
            onChange={(e) => updateField('start_date', e.target.value)}
          />
          <Input
            label="Conclusão"
            type="date"
            value={formData.end_date}
            onChange={(e) => updateField('end_date', e.target.value)}
            disabled={formData.is_current}
          />
          <Checkbox
            label="Cursando"
            checked={formData.is_current}
            onChange={(e) => updateField('is_current', e.target.checked)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          {!education.id.startsWith('temp-') && (
            <Button type="button" variant="destructive" onClick={onDelete}>
              <TrashIcon className="h-4 w-4" />
              Excluir
            </Button>
          )}
          <Button type="submit" variant="primary" rightIcon={<PlusIcon className="h-4 w-4" />}>
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  )
}