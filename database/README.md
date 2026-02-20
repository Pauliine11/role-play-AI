# 🗄️ Base de Données - Le Grimoire Éveillé

**Guide complet pour configurer, maintenir et dépanner la base de données Supabase du projet.**

---

## 📋 Table des Matières

1. [Structure de la Base de Données](#-structure-de-la-base-de-données)
2. [Installation Rapide](#-installation-rapide-2-étapes)
3. [Scripts SQL Disponibles](#-scripts-sql-disponibles)
4. [Vérification et Tests](#-vérification-et-tests)
5. [Ajouter un Nouveau Niveau](#-ajouter-un-nouveau-niveau)
6. [Dépannage](#-dépannage)
7. [Maintenance](#-maintenance)

---

## 📊 Structure de la Base de Données

### Table `levels`
Contient tous les niveaux/chapitres du jeu RPG.

**Colonnes :**
```sql
id            TEXT PRIMARY KEY       -- Identifiant unique (ex: "level-hermione-1")
title         TEXT NOT NULL          -- Titre du niveau
description   TEXT                   -- Description courte
order_index   INTEGER NOT NULL       -- Ordre d'affichage (1, 2, 3, 4...)
is_active     BOOLEAN DEFAULT true   -- Niveau visible ou caché
content       JSONB                  -- Configuration complète du niveau (JSON)
created_at    TIMESTAMPTZ            -- Date de création
```

**Structure du champ `content` (JSONB) :**
```json
{
  "character": "Nom du personnage",
  "initial_mood": "neutral|sad|nervous",
  "location": "Lieu précis",
  "initial_message": "Message d'introduction du personnage",
  "objective": "Objectif du joueur",
  "difficulty": "easy|medium|hard",
  "win_conditions": ["Condition 1", "Condition 2"],
  "lose_conditions": ["Condition 1", "Condition 2"],
  "suggested_actions": ["Action 1", "Action 2", "Action 3"]
}
```

### Table `user_level_progress`
Suit la progression de chaque utilisateur dans les niveaux.

**Colonnes :**
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         TEXT NOT NULL                              -- ID Clerk de l'utilisateur
level_id        TEXT REFERENCES levels(id) ON DELETE CASCADE
is_completed    BOOLEAN DEFAULT false
started_at      TIMESTAMPTZ DEFAULT NOW()
completed_at    TIMESTAMPTZ
UNIQUE(user_id, level_id)                                  -- Un user ne peut avoir qu'une progression par niveau
```

**Index de performance :**
- `idx_levels_active` sur `levels(is_active)`
- `idx_levels_order` sur `levels(order_index)`
- `idx_progress_user` sur `user_level_progress(user_id)`
- `idx_progress_level` sur `user_level_progress(level_id)`

---

## ⚡ Installation Rapide (2 étapes)

### Prérequis
- Un projet Supabase actif
- Accès au **SQL Editor** du dashboard Supabase

### Étape 1 : Convertir la colonne ID (UUID → TEXT)

**Fichier :** `01_fix_id_to_text.sql`

1. Ouvrez **Supabase Dashboard** → **SQL Editor**
2. Copiez-collez **TOUT** le contenu de `01_fix_id_to_text.sql`
3. Cliquez sur **RUN** ▶️

**Ce que fait ce script :**
- Convertit `levels.id` de UUID vers TEXT
- Convertit `user_level_progress.level_id` de UUID vers TEXT
- **Conserve** toutes les données de progression existantes
- Reconstruit les contraintes et index automatiquement

**Résultat attendu :**
```
✅ Tables modifiées avec succès
column_name | data_type | is_nullable
id          | text      | NO
level_id    | text      | NO
```

---

### Étape 2 : Insérer les niveaux

**Fichier :** `02_insert_all_levels.sql`

1. Dans le même **SQL Editor** de Supabase
2. Copiez-collez **TOUT** le contenu de `02_insert_all_levels.sql`
3. Cliquez sur **RUN** ▶️

**Ce que fait ce script :**
- Insère les 4 niveaux (Hermione, Hagrid, Ron, Luna)
- Utilise `ON CONFLICT (id) DO UPDATE` pour mettre à jour si le niveau existe déjà
- **Préserve** votre progression utilisateur
- Configure automatiquement tous les champs `content` en JSON

**Résultat attendu :**
```sql
SELECT id, title, content->>'character' as character FROM levels ORDER BY order_index;

id              | title                                    | character
----------------|------------------------------------------|------------------
level-hermione-1| Bibliothèque de Poudlard - Hermione     | Hermione Granger
level-hagrid-1  | La Cabane d'Hagrid - Secret Interdit    | Hagrid
level-ron-1     | La Salle Commune - Ron Weasley          | Ron Weasley
level-luna-1    | Tour de Serdaigle - Luna et les Nargoles| Luna Lovegood
```

---

### Étape 3 : Nettoyer le cache navigateur

Après la mise à jour de Supabase, nettoyez le cache local :

1. Ouvrez votre jeu dans le navigateur
2. Appuyez sur **F12** (DevTools)
3. Allez dans l'onglet **Console**
4. Copiez-collez ce code et appuyez sur Entrée :

```javascript
localStorage.removeItem('bertrand-story-progress');
console.log('✅ Cache nettoyé - Rechargement...');
window.location.reload();
```

**Pourquoi ?** Le localStorage peut contenir d'anciennes données de niveaux qui entrent en conflit avec les nouvelles.

---

## 📁 Scripts SQL Disponibles

### Scripts Actifs

| Fichier | Description | Utilisation |
|---------|-------------|-------------|
| `01_fix_id_to_text.sql` | Migration UUID → TEXT | **Obligatoire** - À exécuter en premier |
| `02_insert_all_levels.sql` | Insertion des 4 niveaux | **Obligatoire** - À exécuter après 01 |
| `seed.sql` | Seed complet (alternative) | Optionnel - Contient setup + niveaux |

### Scripts Archivés

Les anciens scripts ont été déplacés dans `archive/` :
- `fix_id_column.sql` - Ancienne version de migration
- `insert_levels.sql` - Doublon de 02_insert_all_levels.sql
- `insert_hermione_only.sql` - Insertion partielle obsolète
- `test_*.sql` - Scripts de test
- `migration_fix.sql`, `setup_user_level_progress.sql`, etc.

**Consultez `archive/README.md` pour plus de détails.**

---

## ✅ Vérification et Tests

### 1. Vérifier la structure des tables

```sql
-- Voir le schéma de la table levels
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'levels';

-- Vérifier que les ID sont bien en TEXT
SELECT pg_typeof(id) as id_type FROM levels LIMIT 1;
```

**Résultat attendu :** `id_type = text`

---

### 2. Vérifier les niveaux insérés

```sql
-- Liste complète des niveaux
SELECT 
  id,
  title,
  content->>'character' as character,
  content->>'location' as location,
  content->>'objective' as objective,
  order_index,
  is_active
FROM levels
ORDER BY order_index;
```

**Vous devriez voir 4 lignes** (Hermione, Hagrid, Ron, Luna).

---

### 3. Tester la progression utilisateur

```sql
-- Voir la progression d'un utilisateur spécifique
SELECT 
  l.title,
  l.content->>'character' as character,
  p.is_completed,
  p.started_at,
  p.completed_at
FROM user_level_progress p
JOIN levels l ON l.id = p.level_id
WHERE p.user_id = 'VOTRE_USER_ID_CLERK'
ORDER BY l.order_index;
```

---

### 4. Compter les niveaux actifs

```sql
SELECT COUNT(*) as total_actifs 
FROM levels 
WHERE is_active = true;
```

**Résultat attendu :** `4` (tous les niveaux sont actifs par défaut)

---

## 🎮 Fonctionnement dans le Jeu

### Niveaux Hardcodés (Fallback)
Le niveau Hermione est **toujours disponible** même si la base de données est vide (défini dans `src/features/game/data.ts`).

### Niveaux Dynamiques (Base de Données)
Les niveaux dans la table `levels` avec `is_active = true` sont **chargés automatiquement** et fusionnés avec les niveaux hardcodés.

### Progression Automatique
Quand un utilisateur termine un niveau :
1. `user_level_progress` enregistre `is_completed = true`
2. `completed_at` est mis à jour avec l'heure actuelle
3. Le niveau suivant se déverrouille automatiquement

### Ordre de Progression
```
Hermione (débloqué par défaut)
    ↓
Hagrid (débloqué après Hermione)
    ↓
Ron (débloqué après Hagrid)
    ↓
Luna (débloqué après Ron)
```

---

## 🛠️ Ajouter un Nouveau Niveau

### Option 1 : Via l'Interface Admin

1. Allez sur `/admin/levels/new` dans votre application
2. Remplissez le formulaire :
   - Titre du niveau
   - Description
   - Ordre d'affichage
   - Configuration JSON
3. Cliquez sur **Créer**

Le niveau est ajouté automatiquement en base de données.

---

### Option 2 : Via SQL

```sql
INSERT INTO levels (
  id, 
  title, 
  description, 
  order_index, 
  is_active, 
  content
)
VALUES (
  'level-draco-1',  -- ID unique au format "level-personnage-numero"
  'Manoir des Malefoy - Draco',
  'Confrontation tendue avec Draco Malefoy dans le manoir familial',
  5,  -- Ordre d'affichage (après Luna)
  true,  -- Actif
  '{
    "character": "Draco Malefoy",
    "initial_mood": "arrogant",
    "location": "Manoir des Malefoy",
    "initial_message": "Tiens, tiens... qui ose pénétrer dans le manoir des Malefoy ?",
    "objective": "Découvrir les véritables intentions de Draco malgré son masque d''arrogance",
    "difficulty": "hard",
    "win_conditions": [
      "Draco révèle ses doutes",
      "Une alliance inattendue se forme",
      "Vous gagnez sa confiance"
    ],
    "lose_conditions": [
      "Draco vous expulse du manoir",
      "Il appelle son père",
      "La situation dégénère en duel"
    ],
    "suggested_actions": [
      "Parler des Mangemorts",
      "Mentionner sa mère",
      "Le provoquer sur son honneur",
      "Proposer une alliance"
    ]
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE
SET 
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index;
```

---

## 🐛 Dépannage

### Problème : "Column 'content' does not exist"

**Cause :** La colonne JSON n'a pas été créée.

**Solution :**
```sql
ALTER TABLE levels ADD COLUMN IF NOT EXISTS content JSONB;
```

---

### Problème : "invalid input syntax for type uuid"

**Cause :** La colonne `id` est encore de type UUID au lieu de TEXT.

**Solution :** Exécutez `01_fix_id_to_text.sql` en entier.

---

### Problème : "user_id type mismatch"

**Cause :** Les IDs Clerk sont en `TEXT`, pas en `UUID`.

**Solution :**
```sql
ALTER TABLE user_level_progress 
ALTER COLUMN user_id TYPE TEXT;
```

---

### Problème : Hagrid parle comme Hermione

**Cause :** Le cache localStorage contient d'anciennes données.

**Solution :** Nettoyez le localStorage (voir Étape 3 de l'installation).

---

### Problème : Les niveaux n'apparaissent pas dans le jeu

**Cause 1 :** Les niveaux sont inactifs.

**Solution :**
```sql
UPDATE levels SET is_active = true;
```

**Cause 2 :** La base de données n'est pas configurée dans `.env.local`.

**Solution :** Vérifiez que vous avez :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle
```

---

### Problème : "duplicate key value violates unique constraint"

**Cause :** Vous essayez d'insérer un niveau avec un `id` existant.

**Solution :** Utilisez `ON CONFLICT (id) DO UPDATE` (déjà présent dans `02_insert_all_levels.sql`).

---

### Problème : Ron et Luna n'apparaissent pas

**Cause :** Ils n'ont pas été insérés ou ont `is_active = false`.

**Solution :**
1. Ré-exécutez `02_insert_all_levels.sql`
2. Vérifiez avec :
```sql
SELECT id, title, is_active FROM levels WHERE id IN ('level-ron-1', 'level-luna-1');
```

---

## 🔧 Maintenance

### Réinitialiser toutes les données

**⚠️ ATTENTION : Cela supprime TOUTES les progressions utilisateur !**

```sql
-- Supprimer toutes les progressions
DELETE FROM user_level_progress;

-- Supprimer tous les niveaux
DELETE FROM levels;

-- Puis réexécutez 02_insert_all_levels.sql
```

---

### Activer/Désactiver un niveau

```sql
-- Désactiver Luna (pour test)
UPDATE levels SET is_active = false WHERE id = 'level-luna-1';

-- Réactiver Luna
UPDATE levels SET is_active = true WHERE id = 'level-luna-1';
```

---

### Modifier un niveau existant

```sql
UPDATE levels
SET 
  content = jsonb_set(
    content, 
    '{initial_message}', 
    '"Nouveau message d''introduction"'
  )
WHERE id = 'level-hagrid-1';
```

---

### Changer l'ordre des niveaux

```sql
-- Mettre Hagrid avant Hermione
UPDATE levels SET order_index = 0 WHERE id = 'level-hagrid-1';
UPDATE levels SET order_index = 1 WHERE id = 'level-hermione-1';
```

---

### Voir les statistiques de progression

```sql
-- Nombre d'utilisateurs ayant complété chaque niveau
SELECT 
  l.title,
  COUNT(p.id) as total_utilisateurs,
  SUM(CASE WHEN p.is_completed THEN 1 ELSE 0 END) as completions
FROM levels l
LEFT JOIN user_level_progress p ON p.level_id = l.id
GROUP BY l.id, l.title
ORDER BY l.order_index;
```

---

## 📊 État Actuel

Après avoir exécuté les scripts, vous aurez :

- ✅ **4 niveaux actifs** : Hermione, Hagrid, Ron, Luna
- ✅ **Configuration JSON complète** pour chaque niveau
- ✅ **Progression linéaire** automatique
- ✅ **IDs en TEXT** compatibles avec Clerk
- ✅ **Traductions FR/EN** complètes
- ✅ **Prêt à l'emploi** immédiatement

---

## 🎯 Checklist Post-Installation

- [ ] Tables `levels` et `user_level_progress` créées
- [ ] Script `01_fix_id_to_text.sql` exécuté avec succès
- [ ] Script `02_insert_all_levels.sql` exécuté avec succès
- [ ] 4 niveaux visibles dans Supabase
- [ ] Cache localStorage nettoyé
- [ ] Page d'accueil affiche les 4 cartes de niveau
- [ ] Hagrid répond correctement dans sa cabane
- [ ] Progression entre niveaux fonctionne

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** : Console navigateur (F12) et terminal Next.js
2. **Consultez la section Dépannage** ci-dessus
3. **Vérifiez les variables d'environnement** (`.env.local`)
4. **Relisez les étapes d'installation** dans l'ordre

**Logs de débogage automatiques :**
```
📖 [game/page] Level ID: level-hagrid-1
📖 [game/page] Level Content: { "character": "Hagrid", ... }
🎭 [playTurn] Personnage: Hagrid
📍 [playTurn] Lieu: Cabane d'Hagrid
```

Si les logs montrent un personnage ou lieu incorrect, nettoyez le cache et ré-exécutez `02_insert_all_levels.sql`.

---

**Dernière mise à jour :** 20 février 2026  
**Version de Next.js :** 16.0.3  
**Version de Supabase :** 2.x
