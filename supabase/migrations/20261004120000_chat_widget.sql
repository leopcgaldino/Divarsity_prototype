-- ============================================
-- DIVARSITY - CHAT ESTILO LINKEDIN
-- Reaproveita as tabelas existentes: conversations, conversation_participants
-- e messages_new (todas referenciando public.profiles(id)).
--
-- Toda a lógica do widget passa por funções RPC SECURITY DEFINER, que validam
-- a participação do usuário logado. Assim o chat funciona independentemente de
-- profiles.id ser igual a auth.uid() ou de o vínculo ser feito via profiles.user_id.
-- ============================================

-- --------------------------------------------
-- Helpers
-- --------------------------------------------

-- Retorna o profiles.id do usuário autenticado
CREATE OR REPLACE FUNCTION public.chat_current_profile_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'user_id'
  ) THEN
    EXECUTE 'SELECT id FROM public.profiles WHERE user_id = $1 LIMIT 1'
      INTO v_profile_id USING auth.uid();
  END IF;

  IF v_profile_id IS NULL THEN
    SELECT p.id INTO v_profile_id FROM public.profiles p WHERE p.id = auth.uid();
  END IF;

  RETURN v_profile_id;
END;
$$;

-- O usuário autenticado participa da conversa?
CREATE OR REPLACE FUNCTION public.chat_is_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = p_conversation_id
      AND cp.user_id = public.chat_current_profile_id()
      AND cp.left_at IS NULL
  );
$$;

-- --------------------------------------------
-- Índices
-- --------------------------------------------
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_new_conversation_id ON public.messages_new(conversation_id, created_at DESC);

-- --------------------------------------------
-- RLS complementar (políticas permissivas são combinadas com OR)
-- Permite que participantes vejam os demais participantes e as mensagens,
-- o que também habilita o Supabase Realtime para o widget.
-- --------------------------------------------
DROP POLICY IF EXISTS "Chat: participantes veem conversas" ON public.conversations;
CREATE POLICY "Chat: participantes veem conversas" ON public.conversations
  FOR SELECT USING (public.chat_is_participant(id));

DROP POLICY IF EXISTS "Chat: participantes veem participantes" ON public.conversation_participants;
CREATE POLICY "Chat: participantes veem participantes" ON public.conversation_participants
  FOR SELECT USING (public.chat_is_participant(conversation_id));

DROP POLICY IF EXISTS "Chat: participantes veem mensagens" ON public.messages_new;
CREATE POLICY "Chat: participantes veem mensagens" ON public.messages_new
  FOR SELECT USING (public.chat_is_participant(conversation_id));

-- --------------------------------------------
-- Iniciar (ou reaproveitar) conversa direta
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.chat_start_direct(p_other_profile_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me UUID := public.chat_current_profile_id();
  v_conversation_id UUID;
  v_allow BOOLEAN;
BEGIN
  IF v_me IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado ou sem perfil';
  END IF;
  IF p_other_profile_id IS NULL OR p_other_profile_id = v_me THEN
    RAISE EXCEPTION 'Destinatário inválido';
  END IF;

  -- Evita conversas duplicadas criadas em paralelo para o mesmo par
  PERFORM pg_advisory_xact_lock(
    hashtext(LEAST(v_me::text, p_other_profile_id::text) || GREATEST(v_me::text, p_other_profile_id::text))
  );

  SELECT c.id INTO v_conversation_id
  FROM public.conversations c
  JOIN public.conversation_participants a ON a.conversation_id = c.id AND a.user_id = v_me
  JOIN public.conversation_participants b ON b.conversation_id = c.id AND b.user_id = p_other_profile_id
  WHERE COALESCE(c.type, 'direct') = 'direct'
  ORDER BY c.created_at
  LIMIT 1;

  IF v_conversation_id IS NOT NULL THEN
    -- Reativa a participação caso alguém tenha saído
    UPDATE public.conversation_participants
      SET left_at = NULL
      WHERE conversation_id = v_conversation_id AND user_id IN (v_me, p_other_profile_id);
    RETURN v_conversation_id;
  END IF;

  SELECT COALESCE(p.allow_direct_messages, TRUE) INTO v_allow
  FROM public.profiles p WHERE p.id = p_other_profile_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Perfil não encontrado';
  END IF;
  IF NOT v_allow THEN
    RAISE EXCEPTION 'Este perfil não aceita mensagens diretas';
  END IF;

  INSERT INTO public.conversations (type, created_by)
  VALUES ('direct', v_me)
  RETURNING id INTO v_conversation_id;

  INSERT INTO public.conversation_participants (conversation_id, user_id, last_read_at)
  VALUES (v_conversation_id, v_me, NOW()), (v_conversation_id, p_other_profile_id, NULL);

  RETURN v_conversation_id;
END;
$$;

-- --------------------------------------------
-- Lista de conversas (com contato, última mensagem e não lidas)
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.chat_list_conversations()
RETURNS TABLE (
  conversation_id UUID,
  other_profile_id UUID,
  other_name TEXT,
  other_avatar_url TEXT,
  other_role TEXT,
  other_headline TEXT,
  other_verified BOOLEAN,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  last_message_is_own BOOLEAN,
  unread_count INTEGER,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me UUID := public.chat_current_profile_id();
BEGIN
  IF v_me IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    op.id,
    op.social_name::TEXT,
    op.avatar_url::TEXT,
    op.role::TEXT,
    op.headline::TEXT,
    (op.verification_status::TEXT = 'verified'),
    lm.content::TEXT,
    lm.created_at,
    (lm.sender_id = v_me),
    (
      SELECT COUNT(*)::INTEGER FROM public.messages_new m
      WHERE m.conversation_id = c.id
        AND m.sender_id <> v_me
        AND COALESCE(m.is_deleted, FALSE) = FALSE
        AND m.created_at > COALESCE(me.last_read_at, '-infinity'::TIMESTAMPTZ)
    ),
    COALESCE(lm.created_at, c.created_at)
  FROM public.conversation_participants me
  JOIN public.conversations c ON c.id = me.conversation_id
  LEFT JOIN LATERAL (
    SELECT cp.user_id FROM public.conversation_participants cp
    WHERE cp.conversation_id = c.id AND cp.user_id <> v_me
    ORDER BY cp.joined_at
    LIMIT 1
  ) other ON TRUE
  LEFT JOIN public.profiles op ON op.id = other.user_id
  LEFT JOIN LATERAL (
    SELECT m.content, m.created_at, m.sender_id FROM public.messages_new m
    WHERE m.conversation_id = c.id AND COALESCE(m.is_deleted, FALSE) = FALSE
    ORDER BY m.created_at DESC
    LIMIT 1
  ) lm ON TRUE
  WHERE me.user_id = v_me
    AND me.left_at IS NULL
  ORDER BY COALESCE(lm.created_at, c.created_at) DESC;
END;
$$;

-- --------------------------------------------
-- Mensagens de uma conversa (incremental via p_after)
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.chat_get_messages(
  p_conversation_id UUID,
  p_after TIMESTAMPTZ DEFAULT NULL,
  p_limit INTEGER DEFAULT 200
)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  is_own BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me UUID := public.chat_current_profile_id();
BEGIN
  IF NOT public.chat_is_participant(p_conversation_id) THEN
    RAISE EXCEPTION 'Acesso negado a esta conversa';
  END IF;

  RETURN QUERY
  SELECT * FROM (
    SELECT m.id, m.conversation_id, m.sender_id, m.content::TEXT, m.created_at, (m.sender_id = v_me)
    FROM public.messages_new m
    WHERE m.conversation_id = p_conversation_id
      AND COALESCE(m.is_deleted, FALSE) = FALSE
      AND (p_after IS NULL OR m.created_at > p_after)
    ORDER BY m.created_at DESC
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 200), 1), 500)
  ) recent
  ORDER BY recent.created_at ASC;
END;
$$;

-- --------------------------------------------
-- Enviar mensagem
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.chat_send_message(p_conversation_id UUID, p_content TEXT)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  sender_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  is_own BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me UUID := public.chat_current_profile_id();
  v_content TEXT := btrim(COALESCE(p_content, ''));
BEGIN
  IF NOT public.chat_is_participant(p_conversation_id) THEN
    RAISE EXCEPTION 'Acesso negado a esta conversa';
  END IF;
  IF v_content = '' THEN
    RAISE EXCEPTION 'A mensagem não pode estar vazia';
  END IF;
  IF char_length(v_content) > 4000 THEN
    RAISE EXCEPTION 'A mensagem excede 4000 caracteres';
  END IF;

  -- Reativa a conversa para quem tinha saído
  UPDATE public.conversation_participants cp SET left_at = NULL
    WHERE cp.conversation_id = p_conversation_id AND cp.left_at IS NOT NULL;

  RETURN QUERY
  WITH inserted AS (
    INSERT INTO public.messages_new (conversation_id, sender_id, content, message_type)
    VALUES (p_conversation_id, v_me, v_content, 'text')
    RETURNING messages_new.id, messages_new.conversation_id, messages_new.sender_id,
              messages_new.content, messages_new.created_at
  )
  SELECT i.id, i.conversation_id, i.sender_id, i.content::TEXT, i.created_at, TRUE FROM inserted i;

  UPDATE public.conversations c SET updated_at = NOW() WHERE c.id = p_conversation_id;
  UPDATE public.conversation_participants cp SET last_read_at = NOW()
    WHERE cp.conversation_id = p_conversation_id AND cp.user_id = v_me;
END;
$$;

-- --------------------------------------------
-- Marcar conversa como lida
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.chat_mark_read(p_conversation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversation_participants
    SET last_read_at = NOW()
    WHERE conversation_id = p_conversation_id
      AND user_id = public.chat_current_profile_id();
END;
$$;

-- --------------------------------------------
-- Buscar pessoas/recrutadores para nova conversa
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.chat_search_profiles(p_query TEXT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  social_name TEXT,
  avatar_url TEXT,
  role TEXT,
  headline TEXT,
  verified BOOLEAN
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me UUID := public.chat_current_profile_id();
  v_query TEXT := btrim(COALESCE(p_query, ''));
BEGIN
  IF v_me IS NULL OR char_length(v_query) < 2 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT p.id, p.social_name::TEXT, p.avatar_url::TEXT, p.role::TEXT, p.headline::TEXT,
         (p.verification_status::TEXT = 'verified')
  FROM public.profiles p
  WHERE p.id <> v_me
    AND COALESCE(p.profile_visibility, TRUE) = TRUE
    AND COALESCE(p.allow_direct_messages, TRUE) = TRUE
    AND (p.social_name ILIKE '%' || v_query || '%' OR p.headline ILIKE '%' || v_query || '%')
  ORDER BY (p.social_name ILIKE v_query || '%') DESC, p.social_name
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 25);
END;
$$;

-- --------------------------------------------
-- Permissões
-- --------------------------------------------
REVOKE ALL ON FUNCTION public.chat_current_profile_id() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.chat_is_participant(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.chat_start_direct(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.chat_list_conversations() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.chat_get_messages(UUID, TIMESTAMPTZ, INTEGER) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.chat_send_message(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.chat_mark_read(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.chat_search_profiles(TEXT, INTEGER) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.chat_current_profile_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_is_participant(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_start_direct(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_list_conversations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_get_messages(UUID, TIMESTAMPTZ, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_send_message(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_mark_read(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.chat_search_profiles(TEXT, INTEGER) TO authenticated;

-- --------------------------------------------
-- Realtime (opcional): o widget também faz polling como fallback
-- --------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages_new'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages_new;
  END IF;
END $$;
