'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input, Textarea, Select, Checkbox, RadioGroup, Card, Badge, Avatar } from '@/components/ui'
import { toastHelpers } from '@/components/ui/Toast'
import { AuthLayout } from '@/components/layout/MainLayout'
import { 
  PRONOUN_LABELS, 
  GENDER_IDENTITY_LABELS, 
  SEXUAL_ORIENTATION_LABELS, 
  AVAILABILITY_LABELS,
  type Pronoun, 
  type GenderIdentity, 
  type SexualOrientation, 
  type AvailabilityType,
  type UserRole,
  type OnboardingFormData,
} from '@/types'
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  CheckCircleIcon,
  UserIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const steps = [
  { id: 'account', title: 'Conta', icon: UserIcon, description: 'Crie sua conta de acesso' },
  { id: 'identity', title: 'Identidade', icon: ShieldCheckIcon, description: 'Como você quer ser chamada' },
  { id: 'legal', title: 'Documentos', icon: BriefcaseIcon, description: 'Dados legais (privados)' },
  { id: 'professional', title: 'Profissional', icon: SparklesIcon, description: 'Seu perfil de trabalho' },
  { id: 'availability', title: 'Disponibilidade', icon: BriefcaseIcon, description: 'Como você quer trabalhar' },
]

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

const availabilityOptions: Array<{ value: AvailabilityType; label: string; description: string }> = [
  { value: 'formal', label: AVAILABILITY_LABELS.formal, description: 'Empregos CLT, PJ, Estágio, Trainee' },
  { value: 'freelance', label: AVAILABILITY_LABELS.freelance, description: 'Projetos por entrega, contratos temporários' },
  { value: 'gig', label: AVAILABILITY_LABELS.gig, description: 'Bicos, diárias, serviços rápidos presenciais' },
]

const commonSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'PHP',
  'Design UI/UX', 'Figma', 'Photoshop', 'Illustrator', 'Marketing Digital', 'SEO',
  'Gestão de Projetos', 'Scrum', 'Agile', 'Data Analysis', 'SQL', 'Excel',
  'Redação', 'Copywriting', 'Tradução', 'Inglês', 'Espanhol', 'Atendimento',
  'Vendas', 'Customer Success', 'RH', 'Recrutamento', 'Finanças', 'Contabilidade',
  'Limpeza', 'Organização', 'Cozinha', 'Cuidados Infantis', 'Cuidados Idosos',
  'Manutenção', 'Elétrica', 'Hidráulica', 'Pintura', 'Montagem', 'Jardinagem',
]

export function OnboardingForm() {
  const router = useRouter()
  const { user, signUp } = useAuth()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customSkillInput, setCustomSkillInput] = useState('')
  const [formData, setFormData] = useState<OnboardingFormData>({
    email: '',
    password: '',
    confirm_password: '',
    role: 'talent',
    social_name: '',
    pronouns: ['prefer_not_to_say'] as Pronoun[],
    custom_pronouns: '',
    gender_identity: 'prefer_not_to_say',
    sexual_orientation: 'prefer_not_to_say',
    gender_identity_new: 'prefer_not_to_say',
    sexual_orientation_new: 'prefer_not_to_say',
    show_identity_publicly: true,
    legal_name: '',
    cpf: '',
    birth_date: '',
    headline: '',
    bio: '',
    availability_types_arr: ['formal'],
    location_city: '',
    location_state: '',
    location_neighborhood: '',
    location_cep: '',
    skills: [],
    experiences: [],
    education: [],
  })
  const [errors, setErrors] = useState<Partial<OnboardingFormData> & { general?: string }>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch (step) {
      case 0: // Account
        if (!formData.email) newErrors.email = 'E-mail é obrigatório'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido'
        if (!formData.password) newErrors.password = 'Senha é obrigatória'
        else if (formData.password.length < 8) newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
        if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Senhas não conferem'
        break
      case 1: // Identity
        if (!formData.social_name.trim()) newErrors.social_name = 'Nome social é obrigatório'
        if (formData.pronouns.length === 0) newErrors.pronouns = 'Selecione pelo menos um pronome'
        if (formData.pronouns.includes('custom') && !formData.custom_pronouns.trim()) {
          newErrors.custom_pronouns = 'Informe seus pronomes personalizados'
        }
        break
      case 2: // Legal
        if (!formData.legal_name.trim()) newErrors.legal_name = 'Nome legal é obrigatório para verificação'
        if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório para verificação'
        else if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF inválido'
        if (!formData.birth_date) newErrors.birth_date = 'Data de nascimento é obrigatória'
        break
      case 3: // Professional
        if (!formData.headline.trim()) newErrors.headline = 'Título profissional é obrigatório'
        break
      case 4: // Availability
        if (formData.availability_types_arr.length === 0) newErrors.availability_types_arr = 'Selecione pelo menos uma modalidade'
        break
    }
    
    setErrors(newErrors as Partial<OnboardingFormData>)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return
    
    setIsSubmitting(true)
    
    try {
      // Sign up user
      const { error: signUpError } = await signUp(formData.email, formData.password, formData.role as 'talent' | 'company')
      if (signUpError) throw signUpError

      // Wait for auth to be ready
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create profile
      const { data: { user: newUser } } = await supabase.auth.getUser()
      if (!newUser) throw new Error('Usuário não encontrado após cadastro')

      const { error: profileError } = await (supabase as any).from('profiles').upsert({
        id: newUser.id,
        user_id: newUser.id,
        social_name: formData.social_name,
        pronouns_arr: formData.pronouns,
        custom_pronouns: formData.custom_pronouns || null,
        gender_identity_new: formData.gender_identity,
        sexual_orientation_new: formData.sexual_orientation,
        show_identity_publicly: formData.show_identity_publicly,
        legal_name: formData.legal_name,
        cpf: formData.cpf.replace(/\D/g, ''),
        birth_date: formData.birth_date,
        headline: formData.headline,
        bio: formData.bio,
        availability_types_arr: formData.availability_types_arr,
        location_city: formData.location_city,
        location_state: formData.location_state,
        location_neighborhood: formData.location_neighborhood,
        location_cep: formData.location_cep.replace(/\D/g, ''),
      }, {
        onConflict: 'id'
      })

      if (profileError) throw profileError

      // Get profile ID (profiles table uses user_id = auth.users.id)
      const { data: profileData } = await (supabase as any).from('profiles').select('id').eq('user_id', newUser.id).single()
      const profileId = profileData?.id
      
      if (!profileId) throw new Error('Perfil não encontrado após criação')

      // Add skills
      if (formData.skills.length > 0) {
        const skillsData = formData.skills.map(skill => ({
          profile_id: profileId,
          skill_name: skill,
          proficiency_level: 3,
        }))
        await (supabase as any).from('profile_skills').insert(skillsData)
      }

      // Add experiences
      if (formData.experiences.length > 0) {
        const experiencesData = formData.experiences.map(exp => ({
          profile_id: profileId,
          ...exp,
        }))
        await (supabase as any).from('experiences_new').insert(experiencesData)
      }

      // Add education
      if (formData.education.length > 0) {
        const educationData = formData.education.map(edu => ({
          profile_id: profileId,
          ...edu,
        }))
        await (supabase as any).from('education').insert(educationData)
      }

      toastHelpers.success('Conta criada com sucesso! Bem-vinda à Divarsity 💜')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Onboarding error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.'
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = <K extends keyof OnboardingFormData>(field: K, value: OnboardingFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const togglePronoun = (pronoun: Pronoun) => {
    setFormData(prev => {
      const current = prev.pronouns
      const next = current.includes(pronoun)
        ? current.filter(p => p !== pronoun)
        : [...current, pronoun]
      // Ensure at least one pronoun
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
    setFormData(prev => {
      const current = prev.skills
      const next = current.includes(skill)
        ? current.filter(s => s !== skill)
        : [...current, skill]
      return { ...prev, skills: next }
    })
  }

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        title: '',
        company: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_current: false,
        work_modality: 'remote',
        location_city: '',
        location_state: '',
      }]
    }))
  }

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }))
  }

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        is_current: false,
      }]
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0: return renderAccountStep()
      case 1: return renderIdentityStep()
      case 2: return renderLegalStep()
      case 3: return renderProfessionalStep()
      case 4: return renderAvailabilityStep()
      default: return null
    }
  }

  const renderAccountStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crie sua conta</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Vamos começar configurando seu acesso à plataforma
        </p>
      </div>

      <div className="space-y-4">
        <RadioGroup
          label="Tipo de conta"
          name="role"
          value={formData.role}
          onChange={(value) => updateField('role', value as UserRole)}
          options={[
            { value: 'talent', label: 'Sou Talentos/Prestadora', description: 'Busco vagas, freelas ou bicos' },
            { value: 'company', label: 'Sou Empresa/Contratante', description: 'Quero anunciar oportunidades' },
          ]}
          orientation="vertical"
        />

        <Input
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          placeholder="seu@email.com"
          autoComplete="email"
          required
        />

        <Input
          label="Senha"
          type="password"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          error={errors.password}
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirmar Senha"
          type="password"
          value={formData.confirm_password}
          onChange={(e) => updateField('confirm_password', e.target.value)}
          error={errors.confirm_password}
          placeholder="Digite novamente"
          autoComplete="new-password"
          required
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Ao continuar, você concorda com nossos <a href="/terms" className="text-primary-600 hover:underline">Termos de Uso</a> e <a href="/privacy" className="text-primary-600 hover:underline">Política de Privacidade</a>.
      </p>
    </div>
  )

  const renderIdentityStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sua Identidade</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Como você gostaria de ser reconhecida na plataforma. Estes dados são <strong>públicos</strong> no seu perfil.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Nome Social *"
          value={formData.social_name}
          onChange={(e) => updateField('social_name', e.target.value)}
          error={errors.social_name}
          placeholder="Como você quer ser chamada"
          autoComplete="name"
          required
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
              error={errors.custom_pronouns}
              placeholder="Ex: ela/elu, ele/delu..."
            />
          )}
          {errors.pronouns && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{errors.pronouns}</p>}
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
          description="Outras pessoas poderão ver sua identidade de gênero e orientação sexual no seu perfil"
          checked={formData.show_identity_publicly}
          onChange={(e) => updateField('show_identity_publicly', e.target.checked)}
        />
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
        <h3 className="font-medium text-primary-800 dark:text-primary-200 flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5" /> Sua privacidade importa
        </h3>
        <p className="mt-2 text-sm text-primary-700 dark:text-primary-300">
          Nome legal, CPF e data de nascimento são usados <strong>apenas para verificação de segurança</strong> 
          e <strong>nunca são exibidos publicamente</strong>. Apenas seu nome social, pronomes e foto aparecem no perfil.
        </p>
      </div>
    </div>
  )

  const renderLegalStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documentos para Verificação</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Estes dados são <strong>estritamente privados</strong> e usados apenas para verificação de identidade e segurança.
          Você receberá o selo "Perfil Verificado" após a validação.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Nome Completo Legal *"
          value={formData.legal_name}
          onChange={(e) => updateField('legal_name', e.target.value)}
          error={errors.legal_name}
          placeholder="Conforme documento oficial"
          autoComplete="name"
          required
        />

        <Input
          label="CPF *"
          value={formData.cpf}
          onChange={(e) => updateField('cpf', e.target.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'))}
          error={errors.cpf}
          placeholder="000.000.000-00"
          maxLength={14}
          autoComplete="off"
          required
        />

        <Input
          label="Data de Nascimento *"
          type="date"
          value={formData.birth_date}
          onChange={(e) => updateField('birth_date', e.target.value)}
          error={errors.birth_date}
          required
        />
      </div>

      <div className="bg-gradient-to-r from-pride-red/10 via-pride-orange/10 via-pride-yellow/10 via-pride-green/10 via-pride-blue/10 to-pride-purple/10 border border-pride-purple/20 rounded-xl p-4">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-pride-purple" /> Próximo passo: Biometria
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Após o cadastro, você poderá enviar uma selfie e foto do documento para obter o selo 
          <Badge variant="pride" size="sm">Perfil Verificado</Badge>. Isso garante um ecossistema 100% seguro contra perfis falsos.
        </p>
      </div>
    </div>
  )

  const renderProfessionalStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Perfil Profissional</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Conte sobre você profissionalmente. Isso ajuda recrutadoras e contratantes a te encontrarem.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Título Profissional *"
          value={formData.headline}
          onChange={(e) => updateField('headline', e.target.value)}
          error={errors.headline}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Skills / Competências <span className="text-primary-600">(clique nas tags abaixo para adicionar)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Common skills as clickable suggestions */}
            {commonSkills.map(skill => {
              const isSelected = formData.skills.includes(skill)
              return (
                <Badge
                  key={skill}
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  className={`cursor-pointer transition-colors ${isSelected ? '' : 'hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}
                  removable={isSelected}
                  onRemove={isSelected ? () => toggleSkill(skill) : undefined}
                  onClick={() => !isSelected && toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              )
            })}
            {/* Custom skills badges (already added, not in commonSkills) */}
            {formData.skills.filter(s => !commonSkills.includes(s)).map(skill => (
              <Badge
                key={skill}
                variant="secondary"
                size="sm"
                removable
                onRemove={() => toggleSkill(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              label="Adicionar skill personalizada"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customSkillInput.trim()) {
                  const value = customSkillInput.trim()
                  if (!commonSkills.includes(value) && !formData.skills.includes(value)) {
                    toggleSkill(value)
                    setCustomSkillInput('')
                  }
                }
              }}
              placeholder="Digite uma skill e pressione Enter"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={() => {
                if (customSkillInput.trim()) {
                  const value = customSkillInput.trim()
                  if (!commonSkills.includes(value) && !formData.skills.includes(value)) {
                    toggleSkill(value)
                    setCustomSkillInput('')
                  }
                }
              }}
            >
              Adicionar
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5" /> Experiências Profissionais
          </h4>
          {formData.experiences.map((exp, index) => (
            <Card key={index} variant="outlined" padding="sm" className="mb-3">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900 dark:text-white">Experiência #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remover
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Cargo *"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  placeholder="Ex: Desenvolvedora Full Stack"
                  required
                />
                <Input
                  label="Empresa"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Nome da empresa"
                />
                <Select
                  label="Modalidade"
                  options={[
                    { value: 'remote', label: 'Remoto' },
                    { value: 'hybrid', label: 'Híbrido' },
                    { value: 'onsite', label: 'Presencial' },
                  ]}
                  value={exp.work_modality || 'remote'}
                  onChange={(value) => updateExperience(index, 'work_modality', value)}
                  placeholder="Selecione..."
                />
                <Input
                  label="Início *"
                  type="date"
                  value={exp.start_date}
                  onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                  required
                />
                <Input
                  label="Fim"
                  type="date"
                  value={exp.end_date || ''}
                  onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                />
                <Checkbox
                  label="Atual"
                  checked={exp.is_current}
                  onChange={(e) => updateExperience(index, 'is_current', e.target.checked.toString())}
                />
              </div>
              <Textarea
                label="Descrição"
                value={exp.description || ''}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                placeholder="Principais responsabilidades e conquistas..."
                rows={2}
              />
            </Card>
          ))}
          {formData.experiences.length < 5 && (
            <Button variant="outline" onClick={addExperience} className="w-full">
              + Adicionar Experiência
            </Button>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <UserIcon className="h-5 w-5" /> Formação Acadêmica
          </h4>
          {formData.education.map((edu, index) => (
            <Card key={index} variant="outlined" padding="sm" className="mb-3">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-gray-900 dark:text-white">Formação #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remover
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Instituição *"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="Ex: USP, PUC, Coursera..."
                  required
                />
                <Input
                  label="Curso/Grau"
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Ex: Bacharelado, Pós-graduação, Curso Livre"
                />
                <Input
                  label="Área de Estudo"
                  value={edu.field_of_study || ''}
                  onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                  placeholder="Ex: Ciência da Computação, Design, Administração"
                />
                <Input
                  label="Início"
                  type="date"
                  value={edu.start_date || ''}
                  onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                />
                <Input
                  label="Conclusão"
                  type="date"
                  value={edu.end_date || ''}
                  onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                />
                <Checkbox
                  label="Cursando"
                  checked={edu.is_current}
                  onChange={(e) => updateEducation(index, 'is_current', e.target.checked.toString())}
                />
              </div>
            </Card>
          ))}
          {formData.education.length < 3 && (
            <Button variant="outline" onClick={addEducation} className="w-full">
              + Adicionar Formação
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  const renderAvailabilityStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Como você quer trabalhar?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Selecione todas as modalidades que te interessam. Isso personaliza as oportunidades que você verá.
        </p>
      </div>

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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</p>
            </div>
            {formData.availability_types_arr.includes(option.value) && (
              <CheckCircleIcon className="h-6 w-6 text-primary-600" />
            )}
          </label>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Localização</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Opcional, mas ajuda a encontrar oportunidades presenciais perto de você.
        </p>
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
      </div>
    </div>
  )

  return (
    <AuthLayout>
      <div className="w-full max-w-3xl mx-auto py-12 px-4">
        {/* Progress Steps */}
        <div className="mb-8" role="navigation" aria-label="Progresso do cadastro">
          <ol className="flex items-center" aria-label="Passos do cadastro">
            {steps.map((step, index) => (
              <li key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
                    index < currentStep
                      ? 'bg-primary-600 text-white'
                      : index === currentStep
                      ? 'bg-primary-600 text-white ring-4 ring-primary-200 dark:ring-primary-800'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  )}
                >
                  {index < currentStep ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <div className={cn('hidden sm:block ml-3 text-sm font-medium', index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
                  <div>{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: index < currentStep ? '100%' : 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden sm:block h-0.5 mx-4 bg-gray-200 dark:bg-gray-700"
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card variant="elevated" padding="lg">
                {renderStep()}
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  leftIcon={<ChevronLeftIcon className="h-5 w-5" />}
                >
                  Voltar
                </Button>
                
                <div className="flex items-center gap-3">
                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      rightIcon={<ChevronRightIcon className="h-5 w-5" />}
                    >
                      Finalizar Cadastro
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      rightIcon={<ChevronRightIcon className="h-5 w-5" />}
                    >
                      Próximo
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </AuthLayout>
  )
}