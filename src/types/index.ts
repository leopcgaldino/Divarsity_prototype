// ============================================
// DIVARSITY - TYPESCRIPT TYPES
// ============================================

export type UserRole = 'talent' | 'company' | 'admin';
export type SubscriptionPlan = 'free' | 'premium' | 'plus' | 'corporate';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';
export type OpportunityType = 'formal' | 'freelance' | 'gig';
export type ContractType = 'clt' | 'pj' | 'internship' | 'trainee' | 'freelance' | 'gig';
export type WorkModality = 'remote' | 'hybrid' | 'onsite';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
export type ReportCategory = 'harassment' | 'discrimination' | 'fake_profile' | 'inappropriate_content' | 'scam' | 'other';
export type GenderIdentity = 'cis_woman' | 'trans_woman' | 'non_binary' | 'genderfluid' | 'agender' | 'other' | 'prefer_not_to_say';
export type SexualOrientation = 'lesbian' | 'gay' | 'bisexual' | 'pansexual' | 'asexual' | 'queer' | 'heterosexual' | 'other' | 'prefer_not_to_say';
export type Pronoun = 'she_her' | 'he_him' | 'they_them' | 'elu_delu' | 'custom' | 'prefer_not_to_say';
export type AvailabilityType = 'formal' | 'freelance' | 'gig';

// ============================================
// USER & PROFILE
// ============================================

export interface User {
  id: string;
  email: string;
  role: UserRole;
  email_confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  is_deleted: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  
  // Identidade Social (Público)
  social_name: string;
  pronouns: Pronoun[];
  custom_pronouns: string | null;
  gender_identity_new: GenderIdentity | null;
  sexual_orientation_new: SexualOrientation | null;
  show_identity_publicly: boolean;
  
  // Identidade Legal (Privado)
  legal_name: string | null;
  cpf: string | null;
  birth_date: string | null;
  document_verified_at: string | null;
  biometric_verified_at: string | null;
  verification_status: VerificationStatus;
  verification_document_url: string | null;
  verification_selfie_url: string | null;
  
  // Perfil Profissional
  headline: string | null;
  bio: string | null;
  location_city: string | null;
  location_state: string | null;
  location_neighborhood: string | null;
  location_cep: string | null;
  latitude: number | null;
  longitude: number | null;
  is_open_to_work: boolean;
  availability_types_arr: AvailabilityType[];
  
  // Mídia
  avatar_url: string | null;
  cover_url: string | null;
  
  // Configurações
  profile_visibility: boolean;
  show_online_status: boolean;
  allow_direct_messages: boolean;
  
  // Métricas
  profile_views_count: number;
  connections_count: number;
  
  created_at: string;
  updated_at: string;
}

export interface ProfileSkill {
  id: string;
  profile_id: string;
  skill_name: string;
  proficiency_level: number;
  is_featured: boolean;
  created_at: string;
}

export interface Experience {
  id: string;
  profile_id: string;
  title: string;
  company: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  work_modality: WorkModality | null;
  location_city: string | null;
  location_state: string | null;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  profile_id: string;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: 'image' | 'video' | 'document' | 'link';
  external_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface ExternalLink {
  id: string;
  profile_id: string;
  label: string;
  url: string;
  icon: string | null;
  display_order: number;
  created_at: string;
}

// ============================================
// SUBSCRIPTIONS & PAYMENTS
// ============================================

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_provider: 'stripe' | 'mercado_pago';
  provider_payment_id: string;
  invoice_url: string | null;
  description: string | null;
  created_at: string;
}

// ============================================
// OPPORTUNITIES
// ============================================

export interface Opportunity {
  id: string;
  company_id: string;
  type: OpportunityType;
  contract_type: ContractType;
  work_modality: WorkModality;
  
  title: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  is_salary_negotiable: boolean;
  suggested_price: number | null;
  price_calculator_data: PriceCalculatorData | null;
  
  location_city: string | null;
  location_state: string | null;
  location_neighborhood: string | null;
  location_cep: string | null;
  latitude: number | null;
  longitude: number | null;
  is_location_flexible: boolean;
  
  is_active: boolean;
  is_affirmative_action: boolean;
  affirmative_action_details: string | null;
  expires_at: string | null;
  views_count: number;
  applications_count: number;
  
  created_at: string;
  updated_at: string;
  
  // Joined fields
  company_social_name?: string;
  company_avatar_url?: string;
  company_verification_status?: VerificationStatus;
  skills?: string[];
  has_applied?: boolean;
  is_saved?: boolean;
}

export interface OpportunitySkill {
  id: string;
  opportunity_id: string;
  skill_name: string;
  is_required: boolean;
  created_at: string;
}

export interface OpportunityApplication {
  id: string;
  opportunity_id: string;
  talent_id: string;
  cover_letter: string | null;
  proposed_price: number | null;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  viewed_by_company_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PriceCalculatorData {
  category: string;
  complexity: 'low' | 'medium' | 'high';
  estimated_hours: number;
  suggested_hourly_rate: number;
  market_min: number;
  market_max: number;
  market_avg: number;
  region: string;
  calculated_at: string;
}

// ============================================
// CONNECTIONS & MESSAGING
// ============================================

export interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: ConnectionStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  requester?: PublicProfile;
  recipient?: PublicProfile;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  participants?: ConversationParticipant[];
  last_message?: Message;
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  left_at: string | null;
  is_muted: boolean;
  last_read_at: string | null;
  
  // Joined fields
  user?: PublicProfile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: 'text' | 'image' | 'audio' | 'video' | 'file' | 'system';
  media_url: string | null;
  media_metadata: MessageMediaMetadata | null;
  reply_to_id: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  sender?: PublicProfile;
  reactions?: MessageReaction[];
}

export interface MessageMediaMetadata {
  duration?: number;
  size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  file_name?: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: 'like' | 'love' | 'celebrate' | 'support' | 'insightful';
  created_at: string;
  
  user?: PublicProfile;
}

// ============================================
// AI COPILOT
// ============================================

export interface AICopilotSession {
  id: string;
  user_id: string;
  session_type: 'resume_builder' | 'cover_letter' | 'interview_sim' | 'pricing_advisor';
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown> | null;
  tokens_used: number | null;
  model_used: string | null;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface AIGeneratedDocument {
  id: string;
  user_id: string;
  session_id: string | null;
  document_type: 'resume' | 'cover_letter' | 'portfolio';
  title: string | null;
  content: Record<string, unknown>;
  pdf_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// REPORTS & MODERATION
// ============================================

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string | null;
  reported_opportunity_id: string | null;
  reported_message_id: string | null;
  category: ReportCategory;
  description: string;
  evidence_urls: string[];
  status: ReportStatus;
  moderator_id: string | null;
  moderator_notes: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface ContentModerationLog {
  id: string;
  content_type: 'message' | 'opportunity' | 'profile';
  content_id: string;
  flagged_content: string | null;
  flagged_reason: string | null;
  action_taken: 'none' | 'warning' | 'hidden' | 'deleted' | 'user_suspended';
  confidence_score: number | null;
  created_at: string;
}

// ============================================
// ANALYTICS & ESG
// ============================================

export interface ProfileAnalytics {
  id: string;
  profile_id: string;
  date: string;
  views_count: number;
  search_appearances: number;
  connection_requests: number;
  message_received: number;
  applications_received: number;
  top_search_keywords: string[];
  created_at: string;
}

export interface CompanyESGMetrics {
  id: string;
  company_id: string;
  period_start: string;
  period_end: string;
  total_hires: number;
  diverse_hires: number;
  women_hires: number;
  lgbtq_hires: number;
  trans_hires: number;
  black_hires: number;
  pwd_hires: number;
  opportunities_posted: number;
  affirmative_opportunities: number;
  created_at: string;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// ============================================
// PUBLIC PROFILE (Safe for public display)
// ============================================

export interface PublicProfile {
  id: string;
  social_name: string;
  pronouns: Pronoun[];
  custom_pronouns: string | null;
  gender_identity_new: GenderIdentity | null;
  sexual_orientation_new: SexualOrientation | null;
  show_identity_publicly: boolean;
  headline: string | null;
  bio: string | null;
  location_city: string | null;
  location_state: string | null;
  location_neighborhood: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  availability_types_arr: AvailabilityType[];
  is_open_to_work: boolean;
  verification_status: VerificationStatus;
  connections_count: number;
  created_at: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface OnboardingFormData {
  // Step 1: Account
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
  
  // Step 2: Social Identity
  social_name: string;
  pronouns: Pronoun[];
  custom_pronouns: string;
  gender_identity: GenderIdentity;
  sexual_orientation: SexualOrientation;
  gender_identity_new: GenderIdentity;
  sexual_orientation_new: SexualOrientation;
  show_identity_publicly: boolean;
  
  // Step 3: Legal Identity (Private)
  legal_name: string;
  cpf: string;
  birth_date: string;
  
  // Step 4: Professional
  headline: string;
  bio: string;
  availability_types_arr: AvailabilityType[];
  location_city: string;
  location_state: string;
  location_neighborhood: string;
  location_cep: string;
  
  // Step 5: Skills & Experience
  skills: string[];
  experiences: Omit<Experience, 'id' | 'profile_id' | 'created_at' | 'updated_at'>[];
  education: Omit<Education, 'id' | 'profile_id' | 'created_at'>[];
}

export interface OpportunityFormData {
  type: OpportunityType;
  contract_type: ContractType;
  work_modality: WorkModality;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salary_min: number | null;
  salary_max: number | null;
  is_salary_negotiable: boolean;
  suggested_price: number | null;
  location_city: string;
  location_state: string;
  location_neighborhood: string;
  location_cep: string;
  is_location_flexible: boolean;
  is_affirmative_action: boolean;
  affirmative_action_details: string;
  skills: string[];
  expires_at: string | null;
}

// ============================================
// UI TYPES
// ============================================

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface FilterOptions {
  type?: OpportunityType;
  contract_type?: ContractType;
  work_modality?: WorkModality;
  location_city?: string;
  location_state?: string;
  skills?: string[];
  salary_min?: number;
  is_affirmative_action?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ============================================
// COMMON SKILLS
// ============================================

export const commonSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'PHP',
  'Design UI/UX', 'Figma', 'Photoshop', 'Illustrator', 'Marketing Digital', 'SEO',
  'Gestão de Projetos', 'Scrum', 'Agile', 'Data Analysis', 'SQL', 'Excel',
  'Redação', 'Copywriting', 'Tradução', 'Inglês', 'Espanhol', 'Atendimento',
  'Vendas', 'Customer Success', 'RH', 'Recrutamento', 'Finanças', 'Contabilidade',
  'Limpeza', 'Organização', 'Cozinha', 'Cuidados Infantis', 'Cuidados Idosos',
  'Manutenção', 'Elétrica', 'Hidráulica', 'Pintura', 'Montagem', 'Jardinagem',
] as const satisfies readonly string[]

export type CommonSkill = typeof commonSkills[number]

// ============================================
// PRONOUN DISPLAY HELPERS
// ============================================

export const PRONOUN_LABELS: Record<Pronoun, string> = {
  she_her: 'Ela/Dela',
  he_him: 'Ele/Dele',
  they_them: 'Elu/Delu',
  elu_delu: 'Elu/Delu',
  custom: 'Personalizado',
  prefer_not_to_say: 'Prefiro não informar',
};

export const PRONOUN_SHORT_LABELS: Record<Pronoun, string> = {
  she_her: 'ela/dela',
  he_him: 'ele/dele',
  they_them: 'elu/delu',
  elu_delu: 'elu/delu',
  custom: 'custom',
  prefer_not_to_say: 'não informado',
};

export const GENDER_IDENTITY_LABELS: Record<GenderIdentity, string> = {
  cis_woman: 'Mulher Cisgênera',
  trans_woman: 'Mulher Transgênera',
  non_binary: 'Não-binário',
  genderfluid: 'Gênero Fluido',
  agender: 'Agênero',
  other: 'Outro',
  prefer_not_to_say: 'Prefiro não informar',
};

export const SEXUAL_ORIENTATION_LABELS: Record<SexualOrientation, string> = {
  lesbian: 'Lésbica',
  gay: 'Gay',
  bisexual: 'Bissexual',
  pansexual: 'Pansexual',
  asexual: 'Assexual',
  queer: 'Queer',
  heterosexual: 'Heterossexual',
  other: 'Outro',
  prefer_not_to_say: 'Prefiro não informar',
};

export const AVAILABILITY_LABELS: Record<AvailabilityType, string> = {
  formal: 'Emprego Formal (CLT/PJ)',
  freelance: 'Freelance/Projetos',
  gig: 'Bicos/Serviços Rápidos',
};

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  formal: 'Vagas Formais',
  freelance: 'Freelances',
  gig: 'Bicos & Serviços',
};

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  clt: 'CLT',
  pj: 'PJ',
  internship: 'Estágio',
  trainee: 'Trainee',
  freelance: 'Freelance',
  gig: 'Bico/Serviço Rápido',
};

export const WORK_MODALITY_LABELS: Record<WorkModality, string> = {
  remote: 'Remoto',
  hybrid: 'Híbrido',
  onsite: 'Presencial',
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  pending: 'Pendente',
  verified: 'Verificado',
  rejected: 'Recusado',
};

// ============================================
// PLAN CONFIGURATIONS
// ============================================

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price_monthly: number; // em centavos
  price_yearly: number; // em centavos
  features: string[];
  limits: {
    connections_per_month: number | null;
    profile_visibility_boost: number; // percentual
    ai_copilot_access: boolean;
    analytics_access: boolean;
    who_viewed_profile: boolean;
    instant_alerts: boolean;
    badge: string | null;
  };
  target_audience: 'talent' | 'company';
}

export const TALENT_PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Gratuito',
    description: 'Ideal para começar a explorar oportunidades',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Perfil completo e público',
      'Busca e candidatura a vagas, freelas e bicos',
      'Até 15 conexões por mês',
      'Chat básico com recrutadores',
      'Exportação de currículo em PDF',
    ],
    limits: {
      connections_per_month: 15,
      profile_visibility_boost: 0,
      ai_copilot_access: false,
      analytics_access: false,
      who_viewed_profile: false,
      instant_alerts: false,
      badge: null,
    },
    target_audience: 'talent',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Mais visibilidade e oportunidades',
    price_monthly: 1199, // R$ 11,99
    price_yearly: 11990, // R$ 119,90 (2 meses grátis)
    features: [
      'Tudo do Gratuito',
      '+40% visibilidade nas buscas',
      'Badge "Perfil Destaque Premium"',
      'Alertas instantâneos de novas oportunidades',
      'Quem visitou seu perfil (30 dias)',
      'Filtros avançados de busca',
    ],
    limits: {
      connections_per_month: null, // ilimitado
      profile_visibility_boost: 40,
      ai_copilot_access: false,
      analytics_access: false,
      who_viewed_profile: true,
      instant_alerts: true,
      badge: 'premium',
    },
    target_audience: 'talent',
  },
  {
    id: 'plus',
    name: 'Plus',
    description: 'Poder total com IA para sua carreira',
    price_monthly: 1999, // R$ 19,99
    price_yearly: 19990, // R$ 199,90 (2 meses grátis)
    features: [
      'Tudo do Premium',
      '+70% visibilidade nas buscas e candidaturas',
      'Copiloto de Carreira IA ilimitado',
      'Gerador de currículos e cartas por IA',
      'Simulador de entrevistas por IA',
      'Painel analítico completo do perfil',
      'Dicas de precificação para freelas/bicos',
    ],
    limits: {
      connections_per_month: null,
      profile_visibility_boost: 70,
      ai_copilot_access: true,
      analytics_access: true,
      who_viewed_profile: true,
      instant_alerts: true,
      badge: 'plus',
    },
    target_audience: 'talent',
  },
];

export const COMPANY_PLANS: PlanConfig[] = [
  {
    id: 'corporate',
    name: 'Corporativo',
    description: 'Contratação diversa e relatórios ESG',
    price_monthly: 49900, // R$ 499,00
    price_yearly: 499000, // R$ 4.990,00 (2 meses grátis)
    features: [
      'Anúncios ilimitados de vagas, freelas e bicos',
      'Acesso ao Banco de Talentos Diversos',
      'Filtros avançados de competências e região',
      'Painel ESG de Diversidade completo',
      'Relatórios de impacto social para stakeholders',
      'Badge "Empresa Inclusiva Verificada"',
      'Suporte prioritário',
      'API para integração com ATS',
    ],
    limits: {
      connections_per_month: null,
      profile_visibility_boost: 100,
      ai_copilot_access: false,
      analytics_access: true,
      who_viewed_profile: true,
      instant_alerts: true,
      badge: 'corporate',
    },
    target_audience: 'company',
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatPronouns(pronouns: Pronoun[], custom?: string | null): string {
  if (pronouns.includes('custom') && custom) {
    return custom;
  }
  return pronouns.map(p => PRONOUN_LABELS[p]).join(', ');
}

export function formatShortPronouns(pronouns: Pronoun[], custom?: string | null): string {
  if (pronouns.includes('custom') && custom) {
    return custom;
  }
  return pronouns.map(p => PRONOUN_SHORT_LABELS[p]).join(' / ');
}

export function formatSalary(min: number | null, max: number | null, currency = 'BRL'): string {
  if (!min && !max) return 'A combinar';
  if (min && max && min === max) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(min / 100);
  }
  const parts = [];
  if (min) parts.push(new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(min / 100));
  if (max) parts.push(new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(max / 100));
  return parts.join(' - ');
}

export function getPlanConfig(plan: SubscriptionPlan, role: UserRole): PlanConfig | undefined {
  const plans = role === 'company' ? COMPANY_PLANS : TALENT_PLANS;
  return plans.find(p => p.id === plan);
}

export function canAccessFeature(subscription: Subscription | null, feature: keyof PlanConfig['limits']): boolean {
  if (!subscription) return false;
  const plan = getPlanConfig(subscription.plan, 'talent'); // assume talent for now
  if (!plan) return false;
  return plan.limits[feature] as boolean;
}