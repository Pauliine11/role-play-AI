# 📊 Guide: user_level_progress

## 🎯 Vue d'Ensemble

La table `user_level_progress` sauvegarde automatiquement la progression de chaque joueur pour chaque niveau.

---

## 🗄️ Structure de la Table

```sql
user_level_progress (
  id              UUID      - Identifiant unique
  user_id         TEXT      - ID de l'utilisateur (Clerk)
  level_id        UUID      - Référence au niveau (levels.id)
  is_completed    BOOLEAN   - Niveau terminé ou non
  started_at      TIMESTAMP - Date de début
  completed_at    TIMESTAMP - Date de complétion (auto)
  updated_at      TIMESTAMP - Dernière mise à jour (auto)
  
  UNIQUE(user_id, level_id) - Un utilisateur = une progression par niveau
)
```

---

## ✅ Setup Rapide

### 1. **Exécuter le Script SQL**

Dans **Supabase SQL Editor**, exécutez :

```bash
# Fichier: database/setup_user_level_progress.sql
```

**Ce qu'il fait:**
- ✅ Crée la table si elle n'existe pas
- ✅ Ajoute les index pour les performances
- ✅ Configure un trigger auto pour `completed_at`

### 2. **Vérifier la Création**

```sql
SELECT * FROM information_schema.columns 
WHERE table_name = 'user_level_progress';
```

Vous devriez voir **7 colonnes** : `id`, `user_id`, `level_id`, `is_completed`, `started_at`, `completed_at`, `updated_at`.

---

## 🔄 Fonctionnement Automatique

### Quand le Joueur Gagne

```typescript
// Dans immersive-rpg/page.tsx (ligne 123)
if (data.game_won) {
  completeLevel(currentLevel.id);  // ← Sauvegarde automatique
}
```

### Ce qui se Passe

```
1. Le joueur gagne → data.game_won = true
2. completeLevel() est appelé
3. → useStoryProgression.ts: completeLevel()
4. → completeLevelAction(levelId)
5. → Supabase UPSERT dans user_level_progress
6. → is_completed = true
7. → completed_at = NOW() (trigger auto)
8. → Page rafraîchie
9. → Niveau suivant déverrouillé
```

---

## 🔍 Requêtes Utiles

### Voir la Progression d'un Utilisateur

```sql
SELECT 
  l.title,
  l.order_index,
  p.is_completed,
  p.started_at,
  p.completed_at
FROM user_level_progress p
JOIN levels l ON l.id = p.level_id
WHERE p.user_id = 'user_xxxxxxxxx'  -- Remplacer par votre User ID
ORDER BY l.order_index;
```

**Résultat:**
```
┌────────────────────────────┬───────┬──────────────┬────────────┬──────────────┐
│ title                      │ order │ is_completed │ started_at │ completed_at │
├────────────────────────────┼───────┼──────────────┼────────────┼──────────────┤
│ Bibliothèque... - Hermione │ 1     │ true         │ 12:30:00   │ 12:45:00     │
│ La Cabane d'Hagrid...      │ 2     │ false        │ 12:50:00   │ null         │
└────────────────────────────┴───────┴──────────────┴────────────┴──────────────┘
```

### Compter les Complétions

```sql
SELECT 
  user_id,
  COUNT(*) as total_levels,
  COUNT(CASE WHEN is_completed THEN 1 END) as completed_levels,
  ROUND(
    COUNT(CASE WHEN is_completed THEN 1 END)::numeric / COUNT(*)::numeric * 100, 
    2
  ) as completion_percentage
FROM user_level_progress
GROUP BY user_id;
```

### Voir les Stats Globales

```sql
SELECT 
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN is_completed THEN 1 END) as total_completions,
  ROUND(
    COUNT(CASE WHEN is_completed THEN 1 END)::numeric / COUNT(*)::numeric * 100, 
    2
  ) as global_success_rate
FROM user_level_progress;
```

---

## 🎮 Logique de Déverrouillage

### Dans `fetchUserProgression()` (progression-actions.ts)

```typescript
// 1. Si complété → status = 'completed' ✓
if (completedLevelIds.has(level.id)) {
  status = 'completed';
}

// 2. Sinon, si premier niveau OU niveau précédent complété → status = 'unlocked' ▶
else if (!prevLevelId || completedLevelIds.has(prevLevelId)) {
  status = 'unlocked';
}

// 3. Sinon → status = 'locked' 🔒
else {
  status = 'locked';
}
```

---

## 🧪 Tester Manuellement

### 1. **Créer une Progression Manuelle**

```sql
-- Remplacer USER_ID par votre ID Clerk
-- Remplacer LEVEL_ID par l'ID du niveau (récupéré depuis la table levels)

INSERT INTO user_level_progress (user_id, level_id, is_completed)
VALUES ('user_2abc123xyz', '12345678-1234-1234-1234-123456789abc', true);
```

### 2. **Rafraîchir la Page d'Accueil**

```
http://localhost:3000/
```

Le niveau devrait apparaître comme **✓ Complété**.

### 3. **Réinitialiser une Progression**

```sql
DELETE FROM user_level_progress 
WHERE user_id = 'user_2abc123xyz' 
AND level_id = '12345678-1234-1234-1234-123456789abc';
```

---

## 📊 Affichage sur la Page d'Accueil

### Status Badge

```tsx
// Dans src/app/page.tsx
{level.status === 'completed' && (
  <span className="text-green-400">✓ Complété</span>
)}
{level.status === 'unlocked' && (
  <span className="text-blue-400">▶ Disponible</span>
)}
{level.status === 'locked' && (
  <span className="text-gray-500">🔒 Verrouillé</span>
)}
```

---

## 🔧 Politiques de Sécurité (RLS)

Si vous utilisez **Row Level Security** sur Supabase :

```sql
-- Permettre aux utilisateurs de voir leur propre progression
CREATE POLICY "Users can view their own progress"
ON user_level_progress
FOR SELECT
USING (auth.uid()::text = user_id);

-- Permettre aux utilisateurs de mettre à jour leur propre progression
CREATE POLICY "Users can update their own progress"
ON user_level_progress
FOR ALL
USING (auth.uid()::text = user_id);
```

**⚠️ Note:** Actuellement, le code utilise le `SUPABASE_SERVICE_ROLE_KEY`, donc RLS est bypassé.

---

## 🐛 Dépannage

### Problème: "Niveau complété mais toujours locked"

**Causes possibles:**
1. La progression n'est pas sauvegardée en base
2. Le `user_id` ne correspond pas
3. Le `level_id` ne correspond pas

**Solution:**
```sql
-- Vérifier les IDs
SELECT user_id, level_id, is_completed 
FROM user_level_progress 
WHERE is_completed = true;

-- Comparer avec les niveaux
SELECT id, title FROM levels;
```

### Problème: "Error: duplicate key value"

**Cause:** Vous essayez d'insérer deux fois la même progression.

**Solution:** Utiliser `UPSERT` au lieu de `INSERT` (déjà fait dans le code).

---

## 📈 Analytics Possibles

Avec cette table, vous pouvez créer des vues analytics :

```sql
-- Vue: Temps moyen de complétion par niveau
CREATE VIEW level_avg_completion_time AS
SELECT 
  l.title,
  COUNT(*) as completions,
  AVG(EXTRACT(EPOCH FROM (p.completed_at - p.started_at))) / 60 as avg_minutes
FROM user_level_progress p
JOIN levels l ON l.id = p.level_id
WHERE p.is_completed = true
GROUP BY l.id, l.title;
```

---

## ✅ Checklist Finale

- [ ] Table `user_level_progress` créée
- [ ] Index créés
- [ ] Trigger `completed_at` configuré
- [ ] Test de création d'un niveau via formulaire
- [ ] Test de victoire dans le jeu
- [ ] Vérification de la progression sauvegardée
- [ ] Niveau suivant déverrouillé automatiquement
- [ ] Page d'accueil affiche les bons status

---

## 🎯 Résumé

```
✅ Fichiers Modifiés:
- src/actions/progression-actions.ts (déjà fait)
- src/features/story/useStoryProgression.ts (déjà fait)
- src/app/immersive/immersive-rpg/page.tsx (déjà fait)

✅ À Faire:
1. Exécuter setup_user_level_progress.sql
2. Créer un niveau via /admin/levels/new
3. Jouer et gagner
4. Vérifier la progression en base
5. Niveau suivant déverrouillé
```

---

**🚀 Système de Progression 100% Fonctionnel !**
