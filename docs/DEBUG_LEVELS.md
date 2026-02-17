# 🔍 Debug - Niveaux Manquants

## Problème: Le niveau Hermione n'apparaît pas sur la page d'accueil

---

## ✅ Checklist de Diagnostic

### Étape 1: Vérifier la Base de Données

```sql
-- Dans Supabase SQL Editor, exécuter:

-- 1. Vérifier que la table existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'levels';

-- 2. Compter les niveaux
SELECT COUNT(*) as total FROM levels;

-- 3. Voir tous les niveaux
SELECT id, title, is_active FROM levels;
```

**Résultats Attendus:**
```
Table existe: ✓
Total: 2 (ou plus)
Hermione visible: level-hermione-1
```

**Si la table est vide:**
→ Exécutez `database/insert_levels.sql`

---

### Étape 2: Vérifier l'Authentification Clerk

Le problème pourrait venir de l'authentification:

```typescript
// Dans progression-actions.ts ligne 22-23:
const { userId } = await auth();
if (!userId) return [];  // ← Retourne vide si non connecté !
```

**Solution:**
1. Vérifiez que vous êtes **connecté** (bouton Sign In/User)
2. Ouvrez la console (F12)
3. Cherchez "userId" dans les logs

---

### Étape 3: Vérifier la Console

Ouvrez les DevTools (F12) > Console:

```javascript
// Vous devriez voir:
✅ Niveaux chargés depuis Supabase: 2 niveau(x)

// Ou l'un de ces messages:
⚠️ Aucun niveau trouvé en base de données
📦 Niveaux chargés depuis localStorage
🆕 Première visite - niveaux par défaut
```

**Si vous voyez "Aucun niveau trouvé":**
→ La base de données est vide OU vous n'êtes pas connecté

---

### Étape 4: Test Direct de l'API

Créez un fichier de test:

```typescript
// src/app/test-db/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchUserProgression } from '@/actions/progression-actions';

export default function TestDB() {
  const [levels, setLevels] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function test() {
      try {
        const result = await fetchUserProgression();
        console.log('Résultat fetchUserProgression:', result);
        setLevels(result);
      } catch (e: any) {
        console.error('Erreur:', e);
        setError(e.message);
      }
    }
    test();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test Base de Données</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          Erreur: {error}
        </div>
      )}
      
      <div className="bg-gray-800 text-white p-4 rounded">
        <p>Niveaux trouvés: {levels.length}</p>
        <pre>{JSON.stringify(levels, null, 2)}</pre>
      </div>
    </div>
  );
}
```

**Visitez:** `http://localhost:3000/test-db`

---

### Étape 5: Vérifier les Variables d'Environnement

```bash
# Vérifiez que ces variables existent dans .env.local:

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
```

**Si manquantes:**
→ Créez `.env.local` avec vos credentials Supabase

---

### Étape 6: Vérifier les Permissions Supabase

Dans Supabase Dashboard > Authentication > Policies:

```sql
-- La table 'levels' doit être accessible en lecture

-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'levels';

-- Si aucune policy, créer:
CREATE POLICY "Allow public read access on levels"
ON levels FOR SELECT
USING (true);
```

---

## 🔧 Solutions par Scénario

### Scénario 1: "Aucun niveau trouvé"

**Cause:** Base de données vide

**Solution:**
```bash
1. Ouvrir Supabase SQL Editor
2. Copier database/insert_levels.sql
3. Exécuter
4. Vérifier: SELECT * FROM levels;
5. Rafraîchir la page (F5)
```

---

### Scénario 2: "Unauthorized" ou userId null

**Cause:** Pas connecté avec Clerk

**Solution:**
```bash
1. Vérifier que Clerk est configuré (.env.local)
2. Cliquer sur "Sign In" dans l'app
3. Se connecter avec un compte
4. Rafraîchir la page
```

---

### Scénario 3: Niveaux hardcodés affichés

**Cause:** Fallback sur INITIAL_STORY_LEVELS

**Symptôme:**
- Console: "🆕 Première visite - niveaux par défaut"
- Page affiche quand même Hermione et Hagrid

**Solution:**
- C'est normal ! Le fallback fonctionne
- Mais pour utiliser la DB, exécutez insert_levels.sql

---

### Scénario 4: Erreur Supabase

**Symptômes:**
```javascript
❌ Error fetching progression: 
   Error: Failed to fetch
```

**Solutions:**
```bash
1. Vérifier NEXT_PUBLIC_SUPABASE_URL
2. Vérifier NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Vérifier la connexion Internet
4. Vérifier que le projet Supabase est actif
```

---

## 🧪 Script de Test Complet

Ajoutez des logs détaillés temporaires:

```typescript
// Dans src/features/story/useStoryProgression.ts
// Ligne ~18, juste après setIsLoading(true):

console.log('🔍 DEBUG: Début du chargement des niveaux');
console.log('🔍 DEBUG: Appel fetchUserProgression...');

const dbLevels = await fetchUserProgression();

console.log('🔍 DEBUG: Résultat fetchUserProgression:', dbLevels);
console.log('🔍 DEBUG: Nombre de niveaux:', dbLevels?.length || 0);
console.log('🔍 DEBUG: Détails:', JSON.stringify(dbLevels, null, 2));
```

---

## 📊 Diagnostic Complet

Exécutez tous ces tests:

```sql
-- 1. Table existe ?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'levels'
);

-- 2. Niveaux actifs ?
SELECT COUNT(*) FROM levels WHERE is_active = true;

-- 3. Détails des niveaux
SELECT 
  id,
  title,
  order_index,
  is_active,
  created_at,
  content->>'character' as character
FROM levels
ORDER BY order_index;

-- 4. Vérifier user_level_progress
SELECT COUNT(*) FROM user_level_progress;

-- 5. Policies de sécurité
SELECT * FROM pg_policies WHERE tablename IN ('levels', 'user_level_progress');
```

---

## 🎯 Cause la Plus Probable

**90% des cas:** La base de données est vide

**Solution Rapide:**
```sql
-- Exécutez ceci dans Supabase SQL Editor:

INSERT INTO levels (id, title, description, order_index, is_active, content)
VALUES 
  ('level-hermione-1', 'Bibliothèque de Poudlard - Hermione', 
   'Hermione Granger est désespérée...', 1, true, 
   '{"character": "Hermione Granger", "initial_mood": "sad"}'::jsonb),
  ('level-hagrid-1', 'La Cabane d''Hagrid - Secret Interdit', 
   'Hagrid cache quelque chose...', 2, true,
   '{"character": "Hagrid", "initial_mood": "nervous"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Puis vérifier:
SELECT id, title FROM levels;
```

---

## 🔴 Si Toujours Rien

### Option 1: Mode Debug Intensif

```typescript
// src/actions/progression-actions.ts ligne 22
// Remplacez:
const { userId } = await auth();
if (!userId) return [];

// Par:
const { userId } = await auth();
console.log('🔍 PROGRESSION-ACTIONS: userId =', userId);
if (!userId) {
  console.warn('⚠️ PROGRESSION-ACTIONS: Pas de userId, retour []');
  return [];
}

// Ligne 27, ajoutez:
console.log('🔍 PROGRESSION-ACTIONS: Appel Supabase...');

const { data: levelsData, error: levelsError } = await supabase...

console.log('🔍 PROGRESSION-ACTIONS: levelsData =', levelsData);
console.log('🔍 PROGRESSION-ACTIONS: levelsError =', levelsError);
```

### Option 2: Bypass Auth (TEST UNIQUEMENT)

```typescript
// TEMPORAIRE - Pour tester si le problème vient de l'auth
// Dans progression-actions.ts ligne 22-23:

// Commentez:
// const { userId } = await auth();
// if (!userId) return [];

// Remplacez par:
const userId = 'test-user-123'; // TEMPORAIRE
console.log('⚠️ MODE TEST: userId forcé');
```

---

## ✅ Checklist Finale

- [ ] Table `levels` existe dans Supabase
- [ ] Au moins 2 niveaux dans la table
- [ ] `is_active = true` pour les niveaux
- [ ] IDs sont `level-hermione-1` et `level-hagrid-1`
- [ ] `.env.local` avec credentials Supabase
- [ ] Connecté avec Clerk (Sign In)
- [ ] Console n'affiche pas d'erreur
- [ ] Page rafraîchie (F5)

---

**📞 Si le problème persiste, partagez:**
1. Les logs de la console (F12)
2. Le résultat de `SELECT * FROM levels;`
3. Si vous êtes connecté (bouton User visible ?)
