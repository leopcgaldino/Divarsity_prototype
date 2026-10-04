-- ============================================
-- DIVARSITY - ADD MISSING FEATURES MIGRATION
-- Extends existing schema with additional features
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ADD NEW ENUMS (if not exist)
-- ============================================

DO $$ BEGIN
  CREATE TYPE availability_type AS ENUM ('formal', 'freelance', 'gig');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE pronoun AS ENUM ('she_her', 'he_him', 'they_them', 'elu_delu', 'custom', 'prefer_not_to_say');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE gender_identity AS ENUM ('cis_woman', 'trans_woman', 'non_binary', 'genderfluid', 'agender', 'other', 'prefer_not_to_say');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE sexual_orientation AS ENUM ('lesbian', 'gay', 'bisexual', 'pansexual', 'asexual', 'queer', 'heterosexual', 'other', 'prefer_not_to_say');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_category AS ENUM ('harassment', 'discrimination', 'fake_profile', 'inappropriate_content', 'scam', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- ADD NEW COLUMNS TO EXISTING TABLES
-- ============================================

-- profiles: add missing identity fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS pronouns_arr pronoun[] DEFAULT ARRAY['prefer_not_to_say']::pronoun[],
  ADD COLUMN IF NOT EXISTS custom_pronouns VARCHAR(50),
  ADD COLUMN IF NOT EXISTS gender_identity_new gender_identity,
  ADD COLUMN IF NOT EXISTS sexual_orientation_new sexual_orientation,
  ADD COLUMN IF NOT EXISTS show_identity_publicly BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS legal_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS cpf VARCHAR(14),
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS document_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS biometric_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verification_status_new verification_status DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS verification_document_url TEXT,
  ADD COLUMN IF NOT EXISTS verification_selfie_url TEXT,
  ADD COLUMN IF NOT EXISTS headline VARCHAR(200),
  ADD COLUMN IF NOT EXISTS location_neighborhood VARCHAR(100),
  ADD COLUMN IF NOT EXISTS location_cep VARCHAR(9),
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS is_open_to_work BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS availability_types_arr availability_type[] DEFAULT ARRAY['formal']::availability_type[],
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS profile_visibility BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_online_status BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS allow_direct_messages BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS profile_views_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS connections_count INTEGER DEFAULT 0;

-- opportunities: add missing fields
ALTER TABLE public.opportunities 
  ADD COLUMN IF NOT EXISTS requirements TEXT,
  ADD COLUMN IF NOT EXISTS benefits TEXT,
  ADD COLUMN IF NOT EXISTS salary_currency VARCHAR(3) DEFAULT 'BRL',
  ADD COLUMN IF NOT EXISTS is_salary_negotiable BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS suggested_price INTEGER,
  ADD COLUMN IF NOT EXISTS price_calculator_data JSONB,
  ADD COLUMN IF NOT EXISTS is_location_flexible BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0;

-- connections: add message and status enum
ALTER TABLE public.connections 
  ADD COLUMN IF NOT EXISTS message TEXT,
  ADD COLUMN IF NOT EXISTS status_new connection_status DEFAULT 'pending';

-- ============================================
-- CREATE NEW TABLES
-- ============================================

-- profile_skills (extends existing skills table)
CREATE TABLE IF NOT EXISTS public.profile_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, skill_name)
);

-- experiences (extends existing)
CREATE TABLE IF NOT EXISTS public.experiences_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  company VARCHAR(200),
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  work_mode public.work_mode,
  location_city VARCHAR(100),
  location_state VARCHAR(2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- education
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution VARCHAR(200) NOT NULL,
  degree VARCHAR(200),
  field_of_study VARCHAR(200),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- portfolio_items
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'document', 'link')),
  external_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- external_links
CREATE TABLE IF NOT EXISTS public.external_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- opportunity_skills
CREATE TABLE IF NOT EXISTS public.opportunity_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, skill_name)
);

-- conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) DEFAULT 'direct',
  title VARCHAR(200),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- conversation_participants
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  is_muted BOOLEAN DEFAULT FALSE,
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

-- messages (extends existing)
CREATE TABLE IF NOT EXISTS public.messages_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'file', 'system')),
  media_url TEXT,
  media_metadata JSONB,
  reply_to_id UUID REFERENCES public.messages_new(id) ON DELETE SET NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- message_reactions
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages_new(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction VARCHAR(20) NOT NULL CHECK (reaction IN ('like', 'love', 'celebrate', 'support', 'insightful')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, user_id, reaction)
);

-- ai_copilot_sessions
CREATE TABLE IF NOT EXISTS public.ai_copilot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('resume_builder', 'cover_letter', 'interview_sim', 'pricing_advisor')),
  input_data JSONB NOT NULL,
  output_data JSONB,
  tokens_used INTEGER,
  model_used VARCHAR(50),
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ai_generated_documents
CREATE TABLE IF NOT EXISTS public.ai_generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.ai_copilot_sessions(id) ON DELETE SET NULL,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('resume', 'cover_letter', 'portfolio')),
  title VARCHAR(200),
  content JSONB NOT NULL,
  pdf_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- reports (extends existing)
CREATE TABLE IF NOT EXISTS public.reports_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  reported_message_id UUID REFERENCES public.messages_new(id) ON DELETE SET NULL,
  category report_category NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status report_status DEFAULT 'pending',
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  moderator_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- content_moderation_logs
CREATE TABLE IF NOT EXISTS public.content_moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('message', 'opportunity', 'profile')),
  content_id UUID NOT NULL,
  flagged_content TEXT,
  flagged_reason VARCHAR(100),
  action_taken VARCHAR(50) CHECK (action_taken IN ('none', 'warning', 'hidden', 'deleted', 'user_suspended')),
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- profile_analytics
CREATE TABLE IF NOT EXISTS public.profile_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- company_esg_metrics
CREATE TABLE IF NOT EXISTS public.company_esg_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- common_skills (reference data)
CREATE TABLE IF NOT EXISTS public.common_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- opportunity_categories (for price calculator)
CREATE TABLE IF NOT EXISTS public.opportunity_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('formal', 'freelance', 'gig')),
  base_hourly_rate_min INTEGER NOT NULL,
  base_hourly_rate_max INTEGER NOT NULL,
  base_hourly_rate_avg INTEGER NOT NULL,
  complexity_multipliers JSONB DEFAULT '{"low": 0.8, "medium": 1.0, "high": 1.5}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- regional_multipliers (for price calculator)
CREATE TABLE IF NOT EXISTS public.regional_multipliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state VARCHAR(2) NOT NULL,
  city VARCHAR(100),
  multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state, city)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profile_skills_profile_id ON public.profile_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_experiences_new_profile_id ON public.experiences_new(profile_id);
CREATE INDEX IF NOT EXISTS idx_education_profile_id ON public.education(profile_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_profile_id ON public.portfolio_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_external_links_profile_id ON public.external_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_skills_opportunity_id ON public.opportunity_skills(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_new_conversation_id ON public.messages_new(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_ai_copilot_sessions_user_id ON public.ai_copilot_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_documents_user_id ON public.ai_generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_new_reporter_id ON public.reports_new(reporter_id);
CREATE INDEX IF NOT EXISTS idx_profile_analytics_profile_id ON public.profile_analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_company_esg_metrics_company_id ON public.company_esg_metrics(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_copilot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_esg_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.common_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_multipliers ENABLE ROW LEVEL SECURITY;

-- profile_skills
CREATE POLICY "Users can view own skills" ON public.profile_skills FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own skills" ON public.profile_skills FOR ALL USING (profile_id = auth.uid());

-- experiences_new
CREATE POLICY "Users can view own experiences" ON public.experiences_new FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own experiences" ON public.experiences_new FOR ALL USING (profile_id = auth.uid());

-- education
CREATE POLICY "Users can view own education" ON public.education FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own education" ON public.education FOR ALL USING (profile_id = auth.uid());

-- portfolio_items
CREATE POLICY "Users can view own portfolio" ON public.portfolio_items FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own portfolio" ON public.portfolio_items FOR ALL USING (profile_id = auth.uid());
CREATE POLICY "Public can view featured portfolio" ON public.portfolio_items FOR SELECT USING (is_featured = TRUE AND EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND profile_visibility = TRUE));

-- external_links
CREATE POLICY "Users can view own links" ON public.external_links FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can manage own links" ON public.external_links FOR ALL USING (profile_id = auth.uid());

-- opportunity_skills
CREATE POLICY "Anyone can view opportunity skills" ON public.opportunity_skills FOR SELECT USING (TRUE);
CREATE POLICY "Companies can manage own opportunity skills" ON public.opportunity_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.opportunities WHERE id = opportunity_id AND author_id = auth.uid())
);

-- conversations
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (created_by = auth.uid());

-- conversation_participants
CREATE POLICY "Users can view own participations" ON public.conversation_participants FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can join conversations" ON public.conversation_participants FOR INSERT WITH CHECK (user_id = auth.uid());

-- messages_new
CREATE POLICY "Participants can view messages" ON public.messages_new FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages_new.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Participants can send messages" ON public.messages_new FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages_new.conversation_id AND user_id = auth.uid())
);

-- message_reactions
CREATE POLICY "Participants can view reactions" ON public.message_reactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants cp JOIN public.messages_new m ON m.conversation_id = cp.conversation_id WHERE m.id = message_reactions.message_id AND cp.user_id = auth.uid())
);
CREATE POLICY "Participants can react" ON public.message_reactions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversation_participants cp JOIN public.messages_new m ON m.conversation_id = cp.conversation_id WHERE m.id = message_reactions.message_id AND cp.user_id = auth.uid())
);

-- ai_copilot_sessions
CREATE POLICY "Users can manage own AI sessions" ON public.ai_copilot_sessions FOR ALL USING (user_id = auth.uid());

-- ai_generated_documents
CREATE POLICY "Users can manage own documents" ON public.ai_generated_documents FOR ALL USING (user_id = auth.uid());

-- reports_new
CREATE POLICY "Users can create reports" ON public.reports_new FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Users can view own reports" ON public.reports_new FOR SELECT USING (reporter_id = auth.uid());

-- profile_analytics
CREATE POLICY "Users can view own analytics" ON public.profile_analytics FOR SELECT USING (profile_id = auth.uid());

-- company_esg_metrics
CREATE POLICY "Companies can view own ESG" ON public.company_esg_metrics FOR SELECT USING (company_id = auth.uid());

-- notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- common_skills (public read)
CREATE POLICY "Anyone can view common skills" ON public.common_skills FOR SELECT USING (TRUE);

-- opportunity_categories (public read)
CREATE POLICY "Anyone can view opportunity categories" ON public.opportunity_categories FOR SELECT USING (TRUE);

-- regional_multipliers (public read)
CREATE POLICY "Anyone can view regional multipliers" ON public.regional_multipliers FOR SELECT USING (TRUE);

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

DROP TRIGGER IF EXISTS update_experiences_new_updated_at ON public.experiences_new;
CREATE TRIGGER update_experiences_new_updated_at BEFORE UPDATE ON public.experiences_new FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_new_updated_at ON public.messages_new;
CREATE TRIGGER update_messages_new_updated_at BEFORE UPDATE ON public.messages_new FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_generated_documents_updated_at ON public.ai_generated_documents;
CREATE TRIGGER update_ai_generated_documents_updated_at BEFORE UPDATE ON public.ai_generated_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get public profile (safe fields only)
CREATE OR REPLACE FUNCTION get_public_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  social_name VARCHAR,
  pronouns_arr pronoun[],
  custom_pronouns VARCHAR,
  gender_identity_new gender_identity,
  sexual_orientation_new sexual_orientation,
  headline VARCHAR,
  bio TEXT,
  location_city VARCHAR,
  location_state VARCHAR,
  avatar_url TEXT,
  cover_url TEXT,
  availability_types_arr availability_type[],
  is_open_to_work BOOLEAN,
  verification_status_new verification_status,
  connections_count INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.social_name, p.pronouns_arr, p.custom_pronouns, p.gender_identity_new,
    p.sexual_orientation_new, p.headline, p.bio, p.location_city, p.location_state,
    p.avatar_url, p.cover_url, p.availability_types_arr, p.is_open_to_work,
    p.verification_status_new, p.connections_count, p.created_at
  FROM public.profiles p
  WHERE p.id = p_user_id AND p.profile_visibility = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views(p_profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles SET profile_views_count = profile_views_count + 1 WHERE id = p_profile_id;
  
  INSERT INTO public.profile_analytics (profile_id, date, views_count)
  VALUES (p_profile_id, CURRENT_DATE, 1)
  ON CONFLICT (profile_id, date) DO UPDATE SET views_count = public.profile_analytics.views_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search opportunities with filters
CREATE OR REPLACE FUNCTION search_opportunities(
  p_type public.opp_type DEFAULT NULL,
  p_work_mode public.work_mode DEFAULT NULL,
  p_city VARCHAR DEFAULT NULL,
  p_state VARCHAR DEFAULT NULL,
  p_skills TEXT[] DEFAULT NULL,
  p_salary_min INTEGER DEFAULT NULL,
  p_is_affirmative BOOLEAN DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  type public.opp_type,
  contract public.contract_type,
  work_mode public.work_mode,
  title VARCHAR,
  description TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  is_salary_negotiable BOOLEAN,
  city VARCHAR,
  state VARCHAR,
  is_affirmative BOOLEAN,
  views_count INTEGER,
  applications_count INTEGER,
  created_at TIMESTAMPTZ,
  author_social_name VARCHAR,
  author_avatar_url TEXT,
  author_verification_status VARCHAR,
  skills TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id, o.author_id, o.type, o.contract, o.mode as work_mode,
    o.title, o.description, o.price_min as salary_min, o.price_max as salary_max, o.is_salary_negotiable,
    o.city, o.state, o.is_affirmative, o.views_count, o.applications_count, o.created_at,
    p.social_name as author_social_name,
    p.avatar_url as author_avatar_url,
    p.verification_status as author_verification_status,
    COALESCE(ARRAY_AGG(DISTINCT os.skill_name) FILTER (WHERE os.skill_name IS NOT NULL), '{}') as skills
  FROM public.opportunities o
  JOIN public.profiles p ON p.id = o.author_id
  LEFT JOIN public.opportunity_skills os ON os.opportunity_id = o.id
  WHERE o.is_open = TRUE
    AND (p_type IS NULL OR o.type = p_type)
    AND (p_work_mode IS NULL OR o.mode = p_work_mode)
    AND (p_city IS NULL OR o.city ILIKE p_city)
    AND (p_state IS NULL OR o.state = p_state)
    AND (p_salary_min IS NULL OR o.price_max >= p_salary_min)
    AND (p_is_affirmative IS NULL OR o.is_affirmative = p_is_affirmative)
    AND (p_skills IS NULL OR EXISTS (
      SELECT 1 FROM public.opportunity_skills os2 
      WHERE os2.opportunity_id = o.id 
      AND os2.skill_name = ANY(p_skills)
    ))
  GROUP BY o.id, p.social_name, p.avatar_url, p.verification_status
  ORDER BY o.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON public.common_skills TO anon, authenticated;
GRANT SELECT ON public.opportunity_categories TO anon, authenticated;
GRANT SELECT ON public.regional_multipliers TO anon, authenticated;

-- ============================================
-- SEED REFERENCE DATA
-- ============================================

INSERT INTO public.common_skills (name, category) VALUES
  ('React', 'tech'), ('Node.js', 'tech'), ('Python', 'tech'), ('JavaScript', 'tech'),
  ('TypeScript', 'tech'), ('Java', 'tech'), ('Go', 'tech'), ('PHP', 'tech'),
  ('SQL', 'tech'), ('PostgreSQL', 'tech'), ('MongoDB', 'tech'), ('AWS', 'tech'),
  ('Docker', 'tech'), ('Kubernetes', 'tech'), ('Git', 'tech'), ('CI/CD', 'tech'),
  ('Design UI/UX', 'design'), ('Figma', 'design'), ('Photoshop', 'design'),
  ('Illustrator', 'design'), ('Prototyping', 'design'), ('Design System', 'design'),
  ('Marketing Digital', 'marketing'), ('SEO', 'marketing'), ('Google Ads', 'marketing'),
  ('Facebook Ads', 'marketing'), ('Content Marketing', 'marketing'), ('Email Marketing', 'marketing'),
  ('Analytics', 'marketing'), ('Copywriting', 'marketing'),
  ('Gestão de Projetos', 'business'), ('Scrum', 'business'), ('Agile', 'business'),
  ('Product Management', 'business'), ('Data Analysis', 'business'), ('Excel Avançado', 'business'),
  ('Finanças', 'business'), ('Contabilidade', 'business'), ('Vendas', 'business'),
  ('Customer Success', 'business'), ('RH', 'business'), ('Recrutamento', 'business'),
  ('Limpeza Residencial', 'services'), ('Organização de Ambientes', 'services'),
  ('Cozinha/Chef Particular', 'services'), ('Cuidados Infantis', 'services'),
  ('Cuidados com Idosos', 'services'), ('Manutenção Residencial', 'services'),
  ('Elétrica', 'services'), ('Hidráulica', 'services'), ('Pintura', 'services'),
  ('Montagem de Móveis', 'services'), ('Jardinagem', 'services'), ('Pet Sitter', 'services'),
  ('Personal Trainer', 'services'), ('Aulas Particulares', 'services'),
  ('Inglês Fluente', 'languages'), ('Espanhol Fluente', 'languages'),
  ('Francês', 'languages'), ('Alemão', 'languages'), ('Libras', 'languages')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.opportunity_categories (name, type, base_hourly_rate_min, base_hourly_rate_max, base_hourly_rate_avg) VALUES
  ('Desenvolvimento de Software', 'formal', 5000, 15000, 8500),
  ('Design UI/UX', 'formal', 4000, 12000, 7000),
  ('Marketing Digital', 'formal', 3500, 10000, 6000),
  ('Gestão de Projetos', 'formal', 4500, 13000, 7500),
  ('Data Science/Analytics', 'formal', 5000, 15000, 9000),
  ('Recursos Humanos', 'formal', 3000, 9000, 5500),
  ('Finanças/Contabilidade', 'formal', 3500, 11000, 6500),
  ('Vendas/Comercial', 'formal', 3000, 12000, 5000),
  ('Atendimento/Suporte', 'formal', 2000, 5000, 3000),
  ('Administrativo', 'formal', 2000, 5000, 3000),
  ('Desenvolvimento Web', 'freelance', 8000, 25000, 15000),
  ('Desenvolvimento Mobile', 'freelance', 10000, 30000, 18000),
  ('Design de Interfaces', 'freelance', 5000, 15000, 10000),
  ('Design Gráfico/Branding', 'freelance', 3000, 10000, 6000),
  ('Redação/Content', 'freelance', 2000, 8000, 4000),
  ('Tradução', 'freelance', 3000, 10000, 5000),
  ('Marketing de Conteúdo', 'freelance', 4000, 12000, 7000),
  ('SEO/SEM', 'freelance', 5000, 15000, 8000),
  ('Edição de Vídeo', 'freelance', 4000, 12000, 7000),
  ('Consultoria Tech', 'freelance', 15000, 50000, 25000),
  ('Limpeza Residencial', 'gig', 3000, 6000, 4000),
  ('Faxina Pesada', 'gig', 4000, 8000, 5500),
  ('Organização', 'gig', 3500, 7000, 4500),
  ('Cozinha/Diarista', 'gig', 3000, 6000, 4000),
  ('Babá/Cuidadora', 'gig', 2500, 5000, 3500),
  ('Cuidadora de Idosos', 'gig', 3000, 6000, 4000),
  ('Pet Sitter/Dog Walker', 'gig', 2000, 4000, 3000),
  ('Montagem de Móveis', 'gig', 4000, 10000, 6000),
  ('Pequenos Reparos', 'gig', 3500, 8000, 5000),
  ('Pintura Residencial', 'gig', 5000, 15000, 8000),
  ('Elétrica/Hidráulica', 'gig', 6000, 15000, 9000),
  ('Jardinagem', 'gig', 3000, 7000, 4500),
  ('Personal Trainer', 'gig', 5000, 12000, 8000),
  ('Aulas Particulares', 'gig', 4000, 10000, 6000),
  ('Entregas/Motoboy', 'gig', 2000, 4000, 2800),
  ('Eventos/Recepção', 'gig', 3000, 6000, 4000)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.regional_multipliers (state, city, multiplier) VALUES
  ('SP', 'São Paulo', 1.25), ('SP', 'Campinas', 1.10), ('SP', 'Santos', 1.05),
  ('RJ', 'Rio de Janeiro', 1.20), ('RJ', 'Niterói', 1.10),
  ('MG', 'Belo Horizonte', 1.05), ('RS', 'Porto Alegre', 1.05),
  ('PR', 'Curitiba', 1.05), ('SC', 'Florianópolis', 1.15), ('SC', 'Joinville', 1.05),
  ('DF', 'Brasília', 1.15), ('BA', 'Salvador', 0.95), ('PE', 'Recife', 0.95),
  ('CE', 'Fortaleza', 0.95), ('GO', 'Goiânia', 0.95), ('ES', 'Vitória', 1.00),
  ('AM', 'Manaus', 1.10), ('PA', 'Belém', 0.95),
  ('AC', NULL, 0.90), ('AL', NULL, 0.90), ('AP', NULL, 0.90),
  ('MA', NULL, 0.90), ('MT', NULL, 0.95), ('MS', NULL, 0.95),
  ('RO', NULL, 0.95), ('RR', NULL, 0.95), ('SE', NULL, 0.90),
  ('TO', NULL, 0.90), ('RN', NULL, 0.90), ('PB', NULL, 0.90),
  ('PI', NULL, 0.90)
ON CONFLICT (state, city) DO UPDATE SET multiplier = EXCLUDED.multiplier;