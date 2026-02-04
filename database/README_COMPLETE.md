# 🗄️ Architecture Base de Données Complète

## 📋 Vue d'Ensemble des Tables

### ✅ Tables Existantes
1. **`levels`** - Niveaux de jeu
2. **`user_level_progress`** - Progression des utilisateurs

### 🆕 Nouvelles Tables Proposées

#### 3. **`conversation_messages`** 
💬 Sauvegarde tous les messages des conversations

**Utilité:**
- Historique complet des parties
- Analyse des conversations
- Replay des sessions
- Debug et amélioration de l'IA

**Colonnes:**
- `id` - Identifiant unique
- `user_id` - Utilisateur (Clerk)
- `level_id` - Niveau joué
- `session_id` - ID de la session de jeu
- `role` - 'user', 'assistant', 'system'
- `content` - Contenu du message
- `mood` - Humeur du personnage (nullable)
- `departure_risk` - Risque de départ (nullable)
- `created_at` - Date du message

---

#### 4. **`game_sessions`**
🎮 Métadonnées sur chaque partie jouée

**Utilité:**
- Statistiques par partie
- Durée des sessions
- Taux de réussite
- Analytics

**Colonnes:**
- `id` - Identifiant unique
- `user_id` - Joueur
- `level_id` - Niveau
- `started_at` - Début de la partie
- `ended_at` - Fin de la partie
- `outcome` - 'won', 'lost', 'abandoned', 'in_progress'
- `final_departure_risk` - Risque final
- `message_count` - Nombre de messages
- `duration_seconds` - Durée en secondes
- `language` - 'fr' ou 'en'

---

#### 5. **`user_achievements`**
🏆 Achievements débloqués par les joueurs

**Utilité:**
- Gamification
- Récompenses
- Engagement utilisateur

**Colonnes:**
- `id` - Identifiant
- `user_id` - Joueur
- `achievement_key` - Clé unique (ex: 'first_win')
- `unlocked_at` - Date de déblocage
- `metadata` - Données supplémentaires (JSON)

**Exemples d'achievements:**
- 🏆 **First Victory** - Première victoire
- ⭐ **Perfect Diplomat** - Convaincre sans erreur
- ⚡ **Lightning Fast** - Gagner en < 5 min
- 📝 **Wordsmith** - 100 messages envoyés
- 🦸 **Comeback Kid** - Gagner après 80% de risque
- 😅 **Reckless Survivor** - Survivre à "moldu"

---

#### 6. **`user_stats`**
📊 Statistiques globales par utilisateur

**Utilité:**
- Profil joueur
- Leaderboard
- Analytics
- Progression globale

**Colonnes:**
- `user_id` - Joueur (PRIMARY KEY)
- `total_games_played` - Total de parties
- `total_games_won` - Victoires
- `total_games_lost` - Défaites
- `total_messages_sent` - Messages envoyés
- `total_play_time_seconds` - Temps de jeu total
- `levels_completed` - Niveaux complétés
- `favorite_character` - Personnage préféré
- `best_streak` - Meilleure série
- `current_streak` - Série actuelle
- `last_played_at` - Dernière session
- `created_at` / `updated_at`

---

#### 7. **`player_choices`**
🎯 Analytics des choix des joueurs

**Utilité:**
- Analyse des stratégies
- Choix populaires vs efficaces
- Optimisation de l'IA
- Suggestions intelligentes

**Colonnes:**
- `id` - Identifiant
- `user_id` - Joueur
- `level_id` - Niveau
- `session_id` - Session
- `choice_text` - Texte du choix
- `was_suggested` - Si suggestion ou texte libre
- `response_mood` - Humeur de la réponse
- `risk_change` - Changement de risque
- `created_at`

---

#### 8. **`achievements_config`**
📖 Configuration des achievements

**Colonnes:**
- `key` - Clé unique (PRIMARY KEY)
- `title_fr` / `title_en` - Titres
- `description_fr` / `description_en` - Descriptions
- `icon` - Emoji ou icône
- `points` - Points attribués
- `rarity` - 'common', 'rare', 'epic', 'legendary'

---

## 📊 Vues SQL Créées

### `user_game_history`
Historique complet des parties d'un utilisateur

```sql
SELECT * FROM user_game_history 
WHERE user_id = 'user_xxx'
ORDER BY started_at DESC;
```

### `leaderboard`
Top 100 des meilleurs joueurs

```sql
SELECT * FROM leaderboard LIMIT 10;
```

---

## 🔄 Triggers Automatiques

### `trigger_update_user_stats`
Met à jour automatiquement `user_stats` quand:
- Une nouvelle session est créée → `total_games_played++`
- Une session se termine en victoire → `total_games_won++`, `current_streak++`
- Une session se termine en défaite → `total_games_lost++`, `current_streak = 0`

---

## 🚀 Installation

### 1. Exécuter le schéma
```bash
# Dans Supabase SQL Editor
cat database/schema_conversations.sql
# Copier-coller et exécuter
```

### 2. Vérifier les tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 3. Peupler les achievements
Les achievements sont automatiquement créés avec le schéma.

---

## 🎮 Utilisation dans le Code

### Créer une session de jeu
```typescript
import { createGameSession } from '@/actions/conversation-actions';

const { sessionId } = await createGameSession(levelId, 'fr');
```

### Sauvegarder un message
```typescript
import { saveConversationMessage } from '@/actions/conversation-actions';

await saveConversationMessage(
  sessionId,
  levelId,
  { role: 'user', content: 'Bonjour Hermione' }
);
```

### Terminer une session
```typescript
import { updateGameSession } from '@/actions/conversation-actions';

await updateGameSession(
  sessionId,
  'won', // ou 'lost', 'abandoned'
  finalDepartureRisk,
  messageCount,
  durationSeconds
);
```

### Débloquer un achievement
```typescript
import { unlockAchievement } from '@/actions/conversation-actions';

await unlockAchievement('first_win', {
  level: 'Hermione',
  date: new Date().toISOString()
});
```

### Récupérer les stats
```typescript
import { getUserStats } from '@/actions/conversation-actions';

const { stats } = await getUserStats();
console.log(`Victoires: ${stats.total_games_won}`);
```

---

## 📈 Analytics Possibles

### Requêtes Utiles

#### Top 5 des choix les plus efficaces
```sql
SELECT 
  choice_text,
  AVG(risk_change) as avg_risk_reduction,
  COUNT(*) as usage_count
FROM player_choices
WHERE risk_change < 0  -- Réduction du risque
GROUP BY choice_text
ORDER BY avg_risk_reduction ASC
LIMIT 5;
```

#### Taux de victoire par personnage
```sql
SELECT 
  l.title,
  COUNT(CASE WHEN gs.outcome = 'won' THEN 1 END) as wins,
  COUNT(*) as total,
  ROUND(COUNT(CASE WHEN gs.outcome = 'won' THEN 1 END)::DECIMAL / COUNT(*) * 100, 2) as win_rate
FROM game_sessions gs
JOIN levels l ON l.id = gs.level_id
GROUP BY l.title
ORDER BY win_rate DESC;
```

#### Durée moyenne des parties gagnées vs perdues
```sql
SELECT 
  outcome,
  AVG(duration_seconds) / 60 as avg_duration_minutes,
  AVG(message_count) as avg_messages
FROM game_sessions
WHERE outcome IN ('won', 'lost')
GROUP BY outcome;
```

#### Joueurs les plus actifs
```sql
SELECT 
  user_id,
  COUNT(*) as sessions,
  MAX(started_at) as last_played
FROM game_sessions
GROUP BY user_id
ORDER BY sessions DESC
LIMIT 10;
```

---

## 🎯 Fonctionnalités Futures Possibles

### 1. **Replay System**
```typescript
// Rejouer une conversation complète
const { session } = await getSessionWithMessages(sessionId);
// Afficher message par message avec délai
```

### 2. **Best Practices**
```typescript
// Analyser les meilleures stratégies
const bestChoices = await getBestChoices(levelId);
// Suggérer les choix les plus efficaces
```

### 3. **Daily Challenges**
```sql
CREATE TABLE daily_challenges (
  date DATE PRIMARY KEY,
  level_id UUID REFERENCES levels(id),
  special_rules JSONB,
  reward_achievement TEXT
);
```

### 4. **Social Features**
```sql
CREATE TABLE user_friends (
  user_id TEXT,
  friend_id TEXT,
  created_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, friend_id)
);

-- Comparer les stats avec des amis
```

### 5. **Tutoriels Guidés**
```sql
CREATE TABLE tutorial_progress (
  user_id TEXT PRIMARY KEY,
  current_step INTEGER,
  completed BOOLEAN DEFAULT false
);
```

---

## ⚠️ Considérations

### Performance
- Index créés sur toutes les colonnes fréquemment interrogées
- Vues matérialisées possibles pour les requêtes lourdes
- Pagination recommandée pour les historiques longs

### Vie Privée
- Les `user_id` sont des identifiants Clerk (non sensibles)
- Pas de données personnelles stockées
- Conformité RGPD facilitée

### Coûts Supabase
- **Free Tier**: 500 MB stockage, 50 000 requêtes/mois
- **Pro Tier**: $25/mois, 8 GB, 5M requêtes
- Estimer: ~1 KB par message, ~50 messages/partie
- 1000 parties = ~50 MB

---

## 🧪 Tests

### Script de test complet
```sql
-- 1. Créer une session de test
INSERT INTO game_sessions (user_id, level_id, outcome, language)
VALUES ('test_user', (SELECT id FROM levels LIMIT 1), 'in_progress', 'fr')
RETURNING id;

-- 2. Ajouter des messages
INSERT INTO conversation_messages (user_id, level_id, session_id, role, content)
VALUES 
  ('test_user', 'level_id', 'session_id', 'user', 'Bonjour'),
  ('test_user', 'level_id', 'session_id', 'assistant', 'Salut');

-- 3. Terminer la session
UPDATE game_sessions 
SET outcome = 'won', ended_at = NOW()
WHERE id = 'session_id';

-- 4. Vérifier les stats
SELECT * FROM user_stats WHERE user_id = 'test_user';
```

---

## ✅ Checklist de Migration

- [ ] Exécuter `schema_conversations.sql` dans Supabase
- [ ] Vérifier que toutes les tables sont créées
- [ ] Tester les triggers (insérer une session de test)
- [ ] Vérifier les vues (`user_game_history`, `leaderboard`)
- [ ] Intégrer les actions dans le code du jeu
- [ ] Tester l'enregistrement des conversations
- [ ] Implémenter le système d'achievements
- [ ] Créer une page de profil utilisateur
- [ ] Ajouter une page leaderboard
- [ ] Documenter pour l'équipe

---

**🎉 Votre base de données est maintenant prête pour un jeu RPG complet avec analytics, gamification et historique !**
