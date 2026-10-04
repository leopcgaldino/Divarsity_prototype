-- ============================================
-- DIVARSITY - DATABASE SCHEMA (PostgreSQL/Supabase)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('talent', 'company', 'admin');
CREATE TYPE subscription_plan AS ENUM ('free', 'premium', 'plus', 'corporate');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete', 'trialing');
CREATE TYPE opportunity_type AS ENUM ('formal', 'freelance', 'gig');
CREATE TYPE contract_type AS ENUM ('clt', 'pj', 'internship', 'trainee', 'freelance', 'gig');
CREATE TYPE work_modality AS ENUM ('remote', 'hybrid', 'onsite');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');
CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');
CREATE TYPE report_category AS ENUM ('harassment', 'discrimination', 'fake_profile', 'inappropriate_content', 'scam', 'other');
CREATE TYPE gender_identity AS ENUM ('cis_woman', 'trans_woman', 'non_binary', 'genderfluid', 'agender', 'other', 'prefer_not_to_say');
CREATE TYPE sexual_orientation AS ENUM ('lesbian', 'gay', 'bisexual', 'pansexual', 'asexual', 'queer', 'heterosexual', 'other', 'prefer_not_to_say');
CREATE TYPE pronoun AS ENUM ('she_her', 'he_him', 'they_them', 'elu_delu', 'custom', 'prefer_not_to_say');
CREATE TYPE availability_type AS ENUM ('formal', 'freelance', 'gig');

-- ============================================
-- USERS & PROFILES
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password VARCHAR(255),
  role user_role NOT NULL DEFAULT 'talent',
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Identidade Social (Público)
  social_name VARCHAR(100) NOT NULL,
  pronouns pronoun[] DEFAULT ARRAY['prefer_not_to_say']::pronoun[],
  custom_pronouns VARCHAR(50),
  gender_identity gender_identity,
  sexual_orientation sexual_orientation,
  show_identity_publicly BOOLEAN DEFAULT TRUE,
  
  -- Identidade Legal (Privado - apenas para verificação)
  legal_name VARCHAR(100),
  cpf VARCHAR(14) UNIQUE,
  birth_date DATE,
  document_verified_at TIMESTAMPTZ,
  biometric_verified_at TIMESTAMPTZ,
  verification_status verification_status DEFAULT 'pending',
  verification_document_url TEXT,
  verification_selfie_url TEXT,
  
  -- Perfil Profissional
  headline VARCHAR(200),
  bio TEXT,
  location_city VARCHAR(100),
  location_state VARCHAR(2),
  location_neighborhood VARCHAR(100),
  location_cep VARCHAR(9),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_open_to_work BOOLEAN DEFAULT TRUE,
  availability_types availability_type[] DEFAULT ARRAY['formal']::availability_type[],
  
  -- Mídia
  avatar_url TEXT,
  cover_url TEXT,
  
  -- Configurações
  profile_visibility BOOLEAN DEFAULT TRUE,
  show_online_status BOOLEAN DEFAULT TRUE,
  allow_direct_messages BOOLEAN DEFAULT TRUE,
  
  -- Métricas
  profile_views_count INTEGER DEFAULT 0,
  connections_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profile_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, skill_name)
);

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  company VARCHAR(200),
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  work_modality work_modality,
  location_city VARCHAR(100),
  location_state VARCHAR(2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution VARCHAR(200) NOT NULL,
  degree VARCHAR(200),
  field_of_study VARCHAR(200),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'document', 'link')),
  external_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE external_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS & PAYMENTS
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- em centavos
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL,
  payment_provider VARCHAR(50) NOT NULL, -- 'stripe', 'mercado_pago'
  provider_payment_id VARCHAR(255),
  invoice_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- OPPORTUNITIES (VAGAS, FREELAS, BICOS)
-- ============================================

CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type opportunity_type NOT NULL,
  contract_type contract_type NOT NULL,
  work_modality work_modality NOT NULL,
  
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  
  -- Remuneração
  salary_min INTEGER, -- em centavos
  salary_max INTEGER, -- em centavos
  salary_currency VARCHAR(3) DEFAULT 'BRL',
  is_salary_negotiable BOOLEAN DEFAULT TRUE,
  suggested_price INTEGER, -- para bicos/freelas (em centavos)
  price_calculator_data JSONB, -- dados da calculadora de preço justo
  
  -- Localização
  location_city VARCHAR(100),
  location_state VARCHAR(2),
  location_neighborhood VARCHAR(100),
  location_cep VARCHAR(9),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_location_flexible BOOLEAN DEFAULT FALSE,
  
  -- Configurações
  is_active BOOLEAN DEFAULT TRUE,
  is_affirmative_action BOOLEAN DEFAULT FALSE, -- vaga afirmativa
  affirmative_action_details TEXT,
  expires_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opportunity_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, skill_name)
);

CREATE TABLE opportunity_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  proposed_price INTEGER, -- para freelas/bicos
  status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, accepted, rejected, withdrawn
  viewed_by_company_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, talent_id)
);

-- ============================================
-- CONNECTIONS & MESSAGING
-- ============================================

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status connection_status DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) DEFAULT 'direct', -- 'direct', 'group'
  title VARCHAR(200),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  is_muted BOOLEAN DEFAULT FALSE,
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'audio', 'video', 'file', 'system'
  media_url TEXT,
  media_metadata JSONB, -- { duration, size, mime_type, etc }
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction VARCHAR(20) NOT NULL, -- 'like', 'love', 'celebrate', 'support', 'insightful'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, reaction)
);

-- ============================================
-- AI COPILOT (PLUS FEATURE)
-- ============================================

CREATE TABLE ai_copilot_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(50) NOT NULL, -- 'resume_builder', 'cover_letter', 'interview_sim', 'pricing_advisor'
  input_data JSONB NOT NULL,
  output_data JSONB,
  tokens_used INTEGER,
  model_used VARCHAR(50),
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES ai_copilot_sessions(id) ON DELETE SET NULL,
  document_type VARCHAR(50) NOT NULL, -- 'resume', 'cover_letter', 'portfolio'
  title VARCHAR(200),
  content JSONB NOT NULL,
  pdf_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REPORTS & MODERATION
-- ============================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reported_opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  reported_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  category report_category NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status report_status DEFAULT 'pending',
  moderator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  moderator_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type VARCHAR(50) NOT NULL, -- 'message', 'opportunity', 'profile'
  content_id UUID NOT NULL,
  flagged_content TEXT,
  flagged_reason VARCHAR(100),
  action_taken VARCHAR(50), -- 'none', 'warning', 'hidden', 'deleted', 'user_suspended'
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANALYTICS & ESG
-- ============================================

CREATE TABLE profile_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views_count INTEGER DEFAULT 0,
  search_appearances INTEGER DEFAULT 0,
  connection_requests INTEGER DEFAULT 0,
  message_received INTEGER DEFAULT 0,
  applications_received INTEGER DEFAULT 0,
  top_search_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, date)
);

CREATE TABLE company_esg_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_hires INTEGER DEFAULT 0,
  diverse_hires INTEGER DEFAULT 0,
  women_hires INTEGER DEFAULT 0,
  lgbtq_hires INTEGER DEFAULT 0,
  trans_hires INTEGER DEFAULT 0,
  black_hires INTEGER DEFAULT 0,
  pwd_hires INTEGER DEFAULT 0,
  opportunities_posted INTEGER DEFAULT 0,
  affirmative_opportunities INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, period_start, period_end)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_location ON profiles(location_city, location_state);
CREATE INDEX idx_profiles_availability ON profiles USING GIN(availability_types);
CREATE INDEX idx_profiles_verification ON profiles(verification_status);
CREATE INDEX idx_profiles_headline ON profiles USING GIN(to_tsvector('portuguese', headline));

-- Opportunities
CREATE INDEX idx_opportunities_company ON opportunities(company_id);
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_active ON opportunities(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_opportunities_location ON opportunities(location_city, location_state);
CREATE INDEX idx_opportunities_modality ON opportunities(work_modality);
CREATE INDEX idx_opportunities_skills ON opportunity_skills USING GIN(to_tsvector('portuguese', skill_name));
CREATE INDEX idx_opportunities_fulltext ON opportunities USING GIN(to_tsvector('portuguese', title || ' ' || description));

-- Applications
CREATE INDEX idx_applications_opportunity ON opportunity_applications(opportunity_id);
CREATE INDEX idx_applications_talent ON opportunity_applications(talent_id);
CREATE INDEX idx_applications_status ON opportunity_applications(status);

-- Connections
CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_recipient ON connections(recipient_id);
CREATE INDEX idx_connections_status ON connections(status);

-- Messages
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all active opportunities" ON opportunities FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Companies can manage own opportunities" ON opportunities FOR ALL USING (company_id = auth.uid());
ALTER TABLE opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Talents can view own applications" ON opportunity_applications FOR SELECT USING (talent_id = auth.uid());
CREATE POLICY "Talents can create applications" ON opportunity_applications FOR INSERT WITH CHECK (talent_id = auth.uid());
CREATE POLICY "Companies can view applications to their opportunities" ON opportunity_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM opportunities WHERE id = opportunity_id AND company_id = auth.uid())
);
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connections" ON connections FOR SELECT USING (requester_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can create connection requests" ON connections FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Users can update own connection requests" ON connections FOR UPDATE USING (recipient_id = auth.uid());
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid())
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_copilot_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own AI sessions" ON ai_copilot_sessions FOR ALL USING (user_id = auth.uid());
ALTER TABLE ai_generated_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own documents" ON ai_generated_documents FOR ALL USING (user_id = auth.uid());
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (reporter_id = auth.uid());
ALTER TABLE content_moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analytics" ON profile_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid())
);
ALTER TABLE company_esg_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies can view own ESG metrics" ON company_esg_metrics FOR SELECT USING (company_id = auth.uid());
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_generated_documents_updated_at BEFORE UPDATE ON ai_generated_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Função para buscar perfil público (sem dados sensíveis)
CREATE OR REPLACE FUNCTION get_public_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  social_name VARCHAR,
  pronouns pronoun[],
  custom_pronouns VARCHAR,
  gender_identity gender_identity,
  sexual_orientation sexual_orientation,
  headline VARCHAR,
  bio TEXT,
  location_city VARCHAR,
  location_state VARCHAR,
  avatar_url TEXT,
  cover_url TEXT,
  availability_types availability_type[],
  is_open_to_work BOOLEAN,
  verification_status verification_status,
  connections_count INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.social_name, p.pronouns, p.custom_pronouns, p.gender_identity,
    p.sexual_orientation, p.headline, p.bio, p.location_city, p.location_state,
    p.avatar_url, p.cover_url, p.availability_types, p.is_open_to_work,
    p.verification_status, p.connections_count, p.created_at
  FROM profiles p
  WHERE p.user_id = p_user_id AND p.profile_visibility = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para incrementar visualizações de perfil
CREATE OR REPLACE FUNCTION increment_profile_views(p_profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET profile_views_count = profile_views_count + 1 WHERE id = p_profile_id;
  
  INSERT INTO profile_analytics (profile_id, date, views_count)
  VALUES (p_profile_id, CURRENT_DATE, 1)
  ON CONFLICT (profile_id, date) DO UPDATE SET views_count = profile_analytics.views_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar oportunidades com filtros
CREATE OR REPLACE FUNCTION search_opportunities(
  p_type opportunity_type DEFAULT NULL,
  p_work_modality work_modality DEFAULT NULL,
  p_location_city VARCHAR DEFAULT NULL,
  p_location_state VARCHAR DEFAULT NULL,
  p_skills TEXT[] DEFAULT NULL,
  p_salary_min INTEGER DEFAULT NULL,
  p_is_affirmative BOOLEAN DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  company_id UUID,
  type opportunity_type,
  contract_type contract_type,
  work_modality work_modality,
  title VARCHAR,
  description TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  is_salary_negotiable BOOLEAN,
  location_city VARCHAR,
  location_state VARCHAR,
  is_affirmative_action BOOLEAN,
  affirmative_action_details TEXT,
  views_count INTEGER,
  applications_count INTEGER,
  created_at TIMESTAMPTZ,
  company_social_name VARCHAR,
  company_avatar_url TEXT,
  company_verification_status verification_status,
  skills TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id, o.company_id, o.type, o.contract_type, o.work_modality,
    o.title, o.description, o.salary_min, o.salary_max, o.is_salary_negotiable,
    o.location_city, o.location_state, o.is_affirmative_action, o.affirmative_action_details,
    o.views_count, o.applications_count, o.created_at,
    p.social_name AS company_social_name,
    p.avatar_url AS company_avatar_url,
    p.verification_status AS company_verification_status,
    COALESCE(ARRAY_AGG(DISTINCT os.skill_name) FILTER (WHERE os.skill_name IS NOT NULL), '{}') AS skills
  FROM opportunities o
  JOIN profiles p ON p.user_id = o.company_id
  LEFT JOIN opportunity_skills os ON os.opportunity_id = o.id
  WHERE o.is_active = TRUE
    AND (p_type IS NULL OR o.type = p_type)
    AND (p_work_modality IS NULL OR o.work_modality = p_work_modality)
    AND (p_location_city IS NULL OR o.location_city ILIKE p_location_city)
    AND (p_location_state IS NULL OR o.location_state = p_location_state)
    AND (p_salary_min IS NULL OR o.salary_max >= p_salary_min)
    AND (p_is_affirmative IS NULL OR o.is_affirmative_action = p_is_affirmative)
    AND (p_skills IS NULL OR EXISTS (
      SELECT 1 FROM opportunity_skills os2 
      WHERE os2.opportunity_id = o.id 
      AND os2.skill_name = ANY(p_skills)
    ))
  GROUP BY o.id, p.social_name, p.avatar_url, p.verification_status
  ORDER BY o.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;