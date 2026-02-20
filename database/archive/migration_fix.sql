-- ============================================
-- MIGRATION FIXE - Vérification et Création
-- ============================================
-- Ce script vérifie l'existence des colonnes et les crée si nécessaire

-- ============================================
-- 1. VÉRIFIER ET CORRIGER user_level_progress
-- ============================================

-- Vérifier si la table existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_level_progress') THEN
    -- Créer la table si elle n'existe pas
    CREATE TABLE user_level_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
      is_completed BOOLEAN DEFAULT false,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, level_id)
    );
    
    RAISE NOTICE 'Table user_level_progress créée';
  ELSE
    RAISE NOTICE 'Table user_level_progress existe déjà';
  END IF;
END $$;

-- Ajouter la colonne updated_at si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'user_level_progress' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE user_level_progress ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Colonne updated_at ajoutée à user_level_progress';
  END IF;
END $$;

-- ============================================
-- 2. CRÉER LES NOUVELLES TABLES
-- ============================================

-- Table conversation_messages
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  mood TEXT,
  departure_risk INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table game_sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  outcome TEXT CHECK (outcome IN ('won', 'lost', 'abandoned', 'in_progress')),
  final_departure_risk INTEGER,
  message_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en'))
);

-- Table user_achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, achievement_key)
);

-- Table user_stats
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY,
  total_games_played INTEGER DEFAULT 0,
  total_games_won INTEGER DEFAULT 0,
  total_games_lost INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  total_play_time_seconds INTEGER DEFAULT 0,
  levels_completed INTEGER DEFAULT 0,
  favorite_character TEXT,
  best_streak INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table player_choices
CREATE TABLE IF NOT EXISTS player_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  was_suggested BOOLEAN DEFAULT false,
  response_mood TEXT,
  risk_change INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table achievements_config
CREATE TABLE IF NOT EXISTS achievements_config (
  key TEXT PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  icon TEXT,
  points INTEGER DEFAULT 10,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'))
);

-- ============================================
-- 3. CRÉER LES INDEX
-- ============================================

-- Index pour conversation_messages
CREATE INDEX IF NOT EXISTS idx_conv_user ON conversation_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_conv_session ON conversation_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_conv_level ON conversation_messages(level_id);
CREATE INDEX IF NOT EXISTS idx_conv_created ON conversation_messages(created_at DESC);

-- Index pour game_sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_level ON game_sessions(level_id);
CREATE INDEX IF NOT EXISTS idx_sessions_outcome ON game_sessions(outcome);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON game_sessions(started_at DESC);

-- Index pour user_achievements
CREATE INDEX IF NOT EXISTS idx_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_key ON user_achievements(achievement_key);

-- Index pour player_choices
CREATE INDEX IF NOT EXISTS idx_choices_user ON player_choices(user_id);
CREATE INDEX IF NOT EXISTS idx_choices_session ON player_choices(session_id);

-- Index pour user_level_progress
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_level_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_level ON user_level_progress(level_id);

-- ============================================
-- 4. CRÉER LA FONCTION DE TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO user_stats (user_id, total_games_played, last_played_at)
    VALUES (NEW.user_id, 1, NEW.started_at)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_games_played = user_stats.total_games_played + 1,
      last_played_at = NEW.started_at,
      updated_at = NOW();
  END IF;
  
  IF TG_OP = 'UPDATE' AND OLD.outcome IS DISTINCT FROM NEW.outcome THEN
    IF NEW.outcome = 'won' THEN
      UPDATE user_stats 
      SET 
        total_games_won = total_games_won + 1,
        current_streak = current_streak + 1,
        best_streak = GREATEST(best_streak, current_streak + 1),
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    ELSIF NEW.outcome = 'lost' THEN
      UPDATE user_stats 
      SET 
        total_games_lost = total_games_lost + 1,
        current_streak = 0,
        updated_at = NOW()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. CRÉER LE TRIGGER
-- ============================================

DROP TRIGGER IF EXISTS trigger_update_user_stats ON game_sessions;

CREATE TRIGGER trigger_update_user_stats
AFTER INSERT OR UPDATE ON game_sessions
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- ============================================
-- 6. CRÉER LES VUES
-- ============================================

-- Vue pour l'historique utilisateur
CREATE OR REPLACE VIEW user_game_history AS
SELECT 
  gs.id as session_id,
  gs.user_id,
  l.title as level_title,
  gs.started_at,
  gs.ended_at,
  gs.outcome,
  gs.message_count,
  gs.duration_seconds,
  gs.language,
  COUNT(cm.id) as actual_message_count
FROM game_sessions gs
JOIN levels l ON l.id = gs.level_id
LEFT JOIN conversation_messages cm ON cm.session_id = gs.id
GROUP BY gs.id, gs.user_id, l.title, gs.started_at, gs.ended_at, gs.outcome, gs.message_count, gs.duration_seconds, gs.language
ORDER BY gs.started_at DESC;

-- Vue pour le leaderboard
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  user_id,
  total_games_won,
  total_games_played,
  CASE 
    WHEN total_games_played > 0 
    THEN ROUND((total_games_won::DECIMAL / total_games_played) * 100, 2)
    ELSE 0
  END as win_rate,
  best_streak,
  levels_completed
FROM user_stats
WHERE total_games_played > 0
ORDER BY total_games_won DESC, win_rate DESC
LIMIT 100;

-- ============================================
-- 7. INSÉRER LES ACHIEVEMENTS
-- ============================================

INSERT INTO achievements_config (key, title_fr, title_en, description_fr, description_en, icon, points, rarity)
VALUES 
  ('first_win', 'Première Victoire', 'First Victory', 'Remporter votre première partie', 'Win your first game', '🏆', 10, 'common'),
  ('perfect_hermione', 'Diplomate Parfait', 'Perfect Diplomat', 'Convaincre Hermione sans erreur', 'Convince Hermione without mistakes', '⭐', 50, 'epic'),
  ('speed_runner', 'Éclair de Foudre', 'Lightning Fast', 'Gagner en moins de 5 minutes', 'Win in under 5 minutes', '⚡', 30, 'rare'),
  ('wordsmith', 'Maître des Mots', 'Wordsmith', 'Envoyer 100 messages', 'Send 100 messages', '📝', 20, 'common'),
  ('comeback_kid', 'Retour Héroïque', 'Comeback Kid', 'Gagner après avoir dépassé 80% de risque', 'Win after exceeding 80% risk', '🦸', 40, 'rare'),
  ('moldu_survivor', 'Survivant Imprudent', 'Reckless Survivor', 'Se faire traiter de moldu et ne pas rage quit', 'Get called Muggle and not rage quit', '😅', 5, 'legendary')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 8. VÉRIFICATION FINALE
-- ============================================

DO $$ 
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN (
    'conversation_messages',
    'game_sessions',
    'user_achievements',
    'user_stats',
    'player_choices',
    'achievements_config'
  );
  
  RAISE NOTICE 'Nombre de nouvelles tables créées: %', table_count;
  
  IF table_count = 6 THEN
    RAISE NOTICE '✅ Migration réussie ! Toutes les tables sont créées.';
  ELSE
    RAISE WARNING '⚠️ Seulement % tables sur 6 ont été créées.', table_count;
  END IF;
END $$;

-- Afficher les tables créées
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN (
  'levels',
  'user_level_progress',
  'conversation_messages',
  'game_sessions',
  'user_achievements',
  'user_stats',
  'player_choices',
  'achievements_config'
)
ORDER BY table_name;
