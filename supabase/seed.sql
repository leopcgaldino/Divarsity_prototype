-- ============================================
-- DIVARSITY - SEED DATA FOR LOCAL DEVELOPMENT
-- ============================================

-- Insert test users (passwords are 'test123456' hashed)
-- These will be created via Supabase Auth, so we only seed profiles and reference data

-- ============================================
-- SAMPLE SKILLS REFERENCE DATA
-- ============================================

-- This seed file runs after migrations during `supabase db reset`
-- For local development, you can manually create users via the UI at http://localhost:54323
-- Then run this to populate reference data

-- ============================================
-- COMMON SKILLS (for autocomplete suggestions)
-- ============================================

-- Create a skills reference table for autocomplete (optional enhancement)
CREATE TABLE IF NOT EXISTS public.common_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.common_skills (name, category) VALUES
  -- Tech
  ('React', 'tech'), ('Node.js', 'tech'), ('Python', 'tech'), ('JavaScript', 'tech'),
  ('TypeScript', 'tech'), ('Java', 'tech'), ('Go', 'tech'), ('PHP', 'tech'),
  ('SQL', 'tech'), ('PostgreSQL', 'tech'), ('MongoDB', 'tech'), ('AWS', 'tech'),
  ('Docker', 'tech'), ('Kubernetes', 'tech'), ('Git', 'tech'), ('CI/CD', 'tech'),
  -- Design
  ('Design UI/UX', 'design'), ('Figma', 'design'), ('Photoshop', 'design'),
  ('Illustrator', 'design'), ('Prototyping', 'design'), ('Design System', 'design'),
  -- Marketing
  ('Marketing Digital', 'marketing'), ('SEO', 'marketing'), ('Google Ads', 'marketing'),
  ('Facebook Ads', 'marketing'), ('Content Marketing', 'marketing'), ('Email Marketing', 'marketing'),
  ('Analytics', 'marketing'), ('Copywriting', 'marketing'),
  -- Business
  ('Gestão de Projetos', 'business'), ('Scrum', 'business'), ('Agile', 'business'),
  ('Product Management', 'business'), ('Data Analysis', 'business'), ('Excel Avançado', 'business'),
  ('Finanças', 'business'), ('Contabilidade', 'business'), ('Vendas', 'business'),
  ('Customer Success', 'business'), ('RH', 'business'), ('Recrutamento', 'business'),
  -- Services (Bicos/Gigs)
  ('Limpeza Residencial', 'services'), ('Organização de Ambientes', 'services'),
  ('Cozinha/Chef Particular', 'services'), ('Cuidados Infantis', 'services'),
  ('Cuidados com Idosos', 'services'), ('Manutenção Residencial', 'services'),
  ('Elétrica', 'services'), ('Hidráulica', 'services'), ('Pintura', 'services'),
  ('Montagem de Móveis', 'services'), ('Jardinagem', 'services'), ('Pet Sitter', 'services'),
  ('Personal Trainer', 'services'), ('Aulas Particulares', 'services'),
  -- Languages
  ('Inglês Fluente', 'languages'), ('Espanhol Fluente', 'languages'),
  ('Francês', 'languages'), ('Alemão', 'languages'), ('Libras', 'languages')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SAMPLE OPPORTUNITY CATEGORIES FOR PRICE CALCULATOR
-- ============================================

CREATE TABLE IF NOT EXISTS public.opportunity_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('formal', 'freelance', 'gig')),
  base_hourly_rate_min INTEGER NOT NULL, -- in cents
  base_hourly_rate_max INTEGER NOT NULL,
  base_hourly_rate_avg INTEGER NOT NULL,
  complexity_multipliers JSONB DEFAULT '{"low": 0.8, "medium": 1.0, "high": 1.5}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.opportunity_categories (name, type, base_hourly_rate_min, base_hourly_rate_max, base_hourly_rate_avg) VALUES
  -- Formal (monthly salaries converted to hourly for reference)
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
  
  -- Freelance (project-based)
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
  
  -- Gigs/Bicos (hourly/daily)
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

-- ============================================
-- REGIONAL MULTIPLIERS FOR PRICE CALCULATOR
-- ============================================

CREATE TABLE IF NOT EXISTS public.regional_multipliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state VARCHAR(2) UNIQUE NOT NULL,
  city VARCHAR(100),
  multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.regional_multipliers (state, city, multiplier) VALUES
  ('SP', 'São Paulo', 1.25),
  ('SP', 'Campinas', 1.10),
  ('SP', 'Santos', 1.05),
  ('RJ', 'Rio de Janeiro', 1.20),
  ('RJ', 'Niterói', 1.10),
  ('MG', 'Belo Horizonte', 1.05),
  ('RS', 'Porto Alegre', 1.05),
  ('PR', 'Curitiba', 1.05),
  ('SC', 'Florianópolis', 1.15),
  ('SC', 'Joinville', 1.05),
  ('DF', 'Brasília', 1.15),
  ('BA', 'Salvador', 0.95),
  ('PE', 'Recife', 0.95),
  ('CE', 'Fortaleza', 0.95),
  ('GO', 'Goiânia', 0.95),
  ('ES', 'Vitória', 1.00),
  ('AM', 'Manaus', 1.10),
  ('PA', 'Belém', 0.95),
  -- Default for other cities
  ('AC', NULL, 0.90), ('AL', NULL, 0.90), ('AP', NULL, 0.90),
  ('MA', NULL, 0.90), ('MT', NULL, 0.95), ('MS', NULL, 0.95),
  ('RO', NULL, 0.95), ('RR', NULL, 0.95), ('SE', NULL, 0.90),
  ('TO', NULL, 0.90), ('RN', NULL, 0.90), ('PB', NULL, 0.90),
  ('PI', NULL, 0.90)
ON CONFLICT (state) DO UPDATE SET multiplier = EXCLUDED.multiplier;

-- ============================================
-- GRANT PERMISSIONS FOR SEED DATA
-- ============================================

GRANT SELECT ON public.common_skills TO anon, authenticated;
GRANT SELECT ON public.opportunity_categories TO anon, authenticated;
GRANT SELECT ON public.regional_multipliers TO anon, authenticated;