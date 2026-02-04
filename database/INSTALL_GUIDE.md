# 🚀 Guide d'Installation - Base de Données

## ⚠️ Problème Résolu

L'erreur `column "user_id" does not exist` est due au fait que la table `user_level_progress` n'a peut-être pas toutes les colonnes nécessaires ou n'existe pas encore.

**Solution:** Utiliser le script de migration fixe qui vérifie et crée tout automatiquement.

---

## 📋 Installation en 3 Étapes

### Étape 1: Ouvrir Supabase SQL Editor

1. Aller sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionner votre projet
3. Cliquer sur **SQL Editor** dans le menu de gauche
4. Cliquer sur **New Query**

---

### Étape 2: Copier-Coller le Script

```bash
# Ouvrir le fichier:
database/migration_fix.sql

# Copier TOUT le contenu
# Coller dans le SQL Editor de Supabase
```

---

### Étape 3: Exécuter

1. Cliquer sur **Run** (ou Ctrl+Enter)
2. Attendre quelques secondes
3. Vérifier les messages:

```
✅ NOTICE: Table user_level_progress créée (ou existe déjà)
✅ NOTICE: Nombre de nouvelles tables créées: 6
✅ NOTICE: Migration réussie ! Toutes les tables sont créées.
```

---

## ✅ Vérification

Après l'exécution, vous devriez voir:

```
┌──────────────────────────┬──────────────┐
│ table_name               │ column_count │
├──────────────────────────┼──────────────┤
│ achievements_config      │ 7            │
│ conversation_messages    │ 9            │
│ game_sessions            │ 10           │
│ levels                   │ 7            │
│ player_choices           │ 9            │
│ user_achievements        │ 5            │
│ user_level_progress      │ 7            │
│ user_stats               │ 13           │
└──────────────────────────┴──────────────┘
```

---

## 🔍 Vérifications Supplémentaires

### Vérifier les tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Vérifier les colonnes de user_level_progress
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_level_progress'
ORDER BY ordinal_position;
```

Vous devriez voir:
```
- id (uuid)
- user_id (text)          ← Cette colonne doit exister !
- level_id (uuid)
- is_completed (boolean)
- started_at (timestamptz)
- completed_at (timestamptz)
- updated_at (timestamptz)
```

### Vérifier les achievements
```sql
SELECT key, title_fr, icon, rarity 
FROM achievements_config
ORDER BY rarity, points;
```

### Vérifier les vues
```sql
SELECT viewname 
FROM pg_views 
WHERE schemaname = 'public';
```

Vous devriez voir:
```
- user_game_history
- leaderboard
```

---

## 🐛 En Cas d'Erreur

### Erreur: "table already exists"
✅ **C'est normal !** Le script vérifie et crée seulement ce qui manque.

### Erreur: "relation does not exist"
❌ La table `levels` n'existe pas. Créer d'abord:

```sql
CREATE TABLE IF NOT EXISTS levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Erreur: "permission denied"
❌ Vérifier que vous êtes connecté avec les bons droits.

### Tout supprimer et recommencer
```sql
-- ⚠️ ATTENTION: Cela supprime TOUTES les données !
DROP TABLE IF EXISTS player_choices CASCADE;
DROP TABLE IF EXISTS conversation_messages CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS achievements_config CASCADE;
DROP TABLE IF EXISTS user_level_progress CASCADE;

DROP VIEW IF EXISTS user_game_history;
DROP VIEW IF EXISTS leaderboard;

DROP FUNCTION IF EXISTS update_user_stats() CASCADE;

-- Puis réexécuter migration_fix.sql
```

---

## 📊 Test Rapide

### Insérer une session de test
```sql
-- 1. Créer une session
INSERT INTO game_sessions (user_id, level_id, outcome, language)
VALUES (
  'test_user_123',
  (SELECT id FROM levels ORDER BY order_index LIMIT 1),
  'in_progress',
  'fr'
)
RETURNING id;

-- Copier l'ID retourné, puis:

-- 2. Ajouter des messages (remplacer SESSION_ID et LEVEL_ID)
INSERT INTO conversation_messages (user_id, level_id, session_id, role, content, mood)
VALUES 
  ('test_user_123', 'LEVEL_ID', 'SESSION_ID', 'user', 'Bonjour Hermione', NULL),
  ('test_user_123', 'LEVEL_ID', 'SESSION_ID', 'assistant', 'Bonjour...', 'sad');

-- 3. Terminer la session
UPDATE game_sessions 
SET 
  outcome = 'won',
  ended_at = NOW(),
  message_count = 2,
  duration_seconds = 180
WHERE id = 'SESSION_ID';

-- 4. Vérifier les stats
SELECT * FROM user_stats WHERE user_id = 'test_user_123';
```

Vous devriez voir:
```
user_id: test_user_123
total_games_played: 1
total_games_won: 1
current_streak: 1
```

---

## ✅ Checklist Finale

- [ ] Script `migration_fix.sql` exécuté sans erreur
- [ ] 8 tables existent (levels, user_level_progress + 6 nouvelles)
- [ ] 2 vues créées (user_game_history, leaderboard)
- [ ] 6 achievements insérés dans achievements_config
- [ ] Trigger créé (update_user_stats)
- [ ] Test d'insertion réussi
- [ ] Colonne `user_id` existe dans `user_level_progress` ✓

---

## 🎉 Prochaine Étape

Une fois l'installation réussie, intégrer dans le code:

```typescript
// Voir: INTEGRATION_DB.md
import { useGameSession } from '@/hooks/useGameSession';
```

---

**💡 Astuce:** Si vous avez encore des erreurs, copiez le message d'erreur complet et consultez la section Debug.
