-- ============================================
-- TABLES POUR CONVERSATIONS ET STATISTIQUES
-- ============================================

-- Table pour sauvegarder tous les messages de conversation
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,  -- Permet de regrouper les messages d'une même session
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  mood TEXT,  -- Humeur du personnage au moment du message (si role = assistant)
  departure_risk INTEGER,  -- Risque de départ (si role = assistant)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les sessions de jeu
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  outcome TEXT CHECK (outcome IN ('won', 'lost', 'abandoned', 'in_progress')),
  final_departure_risk INTEGER,
  message_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,  -- Durée de la session en secondes
  language TEXT DEFAULT 'fr' CHECK (language IN ('fr', 'en'))
);

-- Table pour les achievements/succès
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  achievement_key TEXT NOT NULL,  -- Clé unique du succès
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,  -- Données supplémentaires (ex: niveau où c'est arrivé)
  UNIQUE(user_id, achievement_key)
);

-- Table pour les statistiques utilisateur
CREATE TABLE IF NOT EXISTS user_stats (
  user_id TEXT PRIMARY KEY,
  total_games_played INTEGER DEFAULT 0,
  total_games_won INTEGER DEFAULT 0,
  total_games_lost INTEGER DEFAULT 0,
  total_messages_sent INTEGER DEFAULT 0,
  total_play_time_seconds INTEGER DEFAULT 0,
  levels_completed INTEGER DEFAULT 0,
  favorite_character TEXT,  -- Personnage le plus joué
  best_streak INTEGER DEFAULT 0,  -- Meilleure série de victoires
  current_streak INTEGER DEFAULT 0,  -- Série actuelle
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les choix du joueur (analytics)
CREATE TABLE IF NOT EXISTS player_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  was_suggested BOOLEAN DEFAULT false,  -- Si c'était une suggestion ou texte libre
  response_mood TEXT,  -- Humeur de la réponse obtenue
  risk_change INTEGER,  -- Changement du departure_risk après ce choix
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEX POUR PERFORMANCES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_conv_user ON conversation_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_conv_session ON conversation_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_conv_level ON conversation_messages(level_id);
CREATE INDEX IF NOT EXISTS idx_conv_created ON conversation_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_level ON game_sessions(level_id);
CREATE INDEX IF NOT EXISTS idx_sessions_outcome ON game_sessions(outcome);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON game_sessions(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_key ON user_achievements(achievement_key);

CREATE INDEX IF NOT EXISTS idx_choices_user ON player_choices(user_id);
CREATE INDEX IF NOT EXISTS idx_choices_session ON player_choices(session_id);

-- ============================================
-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- ============================================

-- Trigger pour mettre à jour user_stats automatiquement
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Insérer ou incrémenter les stats
    INSERT INTO user_stats (user_id, total_games_played, last_played_at)
    VALUES (NEW.user_id, 1, NEW.started_at)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_games_played = user_stats.total_games_played + 1,
      last_played_at = NEW.started_at,
      updated_at = NOW();
  END IF;
  
  IF TG_OP = 'UPDATE' AND OLD.outcome != NEW.outcome THEN
    -- Mettre à jour les victoires/défaites
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

CREATE TRIGGER trigger_update_user_stats
AFTER INSERT OR UPDATE ON game_sessions
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue pour voir l'historique complet d'un utilisateur
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
GROUP BY gs.id, l.title
ORDER BY gs.started_at DESC;

-- Vue pour voir les meilleurs joueurs
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  user_id,
  total_games_won,
  total_games_played,
  ROUND((total_games_won::DECIMAL / NULLIF(total_games_played, 0)) * 100, 2) as win_rate,
  best_streak,
  levels_completed
FROM user_stats
WHERE total_games_played > 0
ORDER BY total_games_won DESC, win_rate DESC
LIMIT 100;

-- ============================================
-- DONNÉES DE TEST POUR ACHIEVEMENTS
-- ============================================

-- Vous pouvez définir vos achievements dans une table séparée
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

-- Exemples d'achievements
INSERT INTO achievements_config (key, title_fr, title_en, description_fr, description_en, icon, points, rarity)
VALUES 
  ('first_win', 'Première Victoire', 'First Victory', 'Remporter votre première partie', 'Win your first game', '🏆', 10, 'common'),
  ('perfect_hermione', 'Diplomate Parfait', 'Perfect Diplomat', 'Convaincre Hermione sans erreur', 'Convince Hermione without mistakes', '⭐', 50, 'epic'),
  ('speed_runner', 'Éclair de Foudre', 'Lightning Fast', 'Gagner en moins de 5 minutes', 'Win in under 5 minutes', '⚡', 30, 'rare'),
  ('wordsmith', 'Maître des Mots', 'Wordsmith', 'Envoyer 100 messages', 'Send 100 messages', '📝', 20, 'common'),
  ('comeback_kid', 'Retour Héroïque', 'Comeback Kid', 'Gagner après avoir dépassé 80% de risque', 'Win after exceeding 80% risk', '🦸', 40, 'rare'),
  ('moldu_survivor', 'Survivant Imprudent', 'Reckless Survivor', 'Se faire traiter de moldu et ne pas rage quit', 'Get called Muggle and not rage quit', '😅', 5, 'legendary')
ON CONFLICT (key) DO NOTHING;
