# 📊 Système de Progression - Base de Données

## ✅ Intégration Complète

La progression des joueurs est maintenant **automatiquement sauvegardée** dans la table `user_level_progress` de Supabase !

---

## 🔄 Flux de Données

### Au Chargement de l'Application

```
1. Utilisateur ouvre l'app
   └── useStoryProgression() s'initialise

2. Chargement de la progression
   ├── 🗄️ Tenter de charger depuis Supabase (source de vérité)
   │   └── fetchUserProgression() → SELECT * FROM user_level_progress
   │
   ├── Si données trouvées en DB:
   │   ├── Utiliser les données Supabase
   │   └── Sauvegarder copie dans localStorage (cache)
   │
   └── Si pas de données en DB:
       ├── Vérifier localStorage
       ├── Si localStorage valide → utiliser
       └── Sinon → utiliser INITIAL_STORY_LEVELS

3. Affichage des niveaux
   └── Page d'accueil affiche les cartes avec statuts corrects
```

---

### Quand un Niveau est Complété

```
1. Joueur gagne une partie
   └── data.game_won = true

2. Appel de completeLevel(currentLevel.id)
   │
   ├── 🗄️ Sauvegarde dans Supabase
   │   └── completeLevelAction(levelId)
   │       └── UPSERT INTO user_level_progress
   │           ├── user_id: userId (Clerk)
   │           ├── level_id: levelId
   │           ├── is_completed: true
   │           └── updated_at: NOW()
   │
   ├── 💾 Mise à jour de l'état local (React)
   │   ├── Marquer le niveau comme 'completed'
   │   └── Débloquer le niveau suivant
   │
   └── 📦 Sauvegarde dans localStorage (cache)
       └── Pour accès hors ligne/rapide

3. UI se met à jour immédiatement
   ├── Badge: ✓ Complété
   ├── Border: Vert
   └── Niveau suivant débloqué
```

---

## 🗄️ Structure Base de Données

### Table: `user_level_progress`

```sql
CREATE TABLE user_level_progress (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,              -- ID Clerk de l'utilisateur
  level_id UUID REFERENCES levels(id),-- ID du niveau
  is_completed BOOLEAN DEFAULT false, -- Niveau terminé ?
  started_at TIMESTAMPTZ,             -- Date de début
  completed_at TIMESTAMPTZ,           -- Date de fin
  updated_at TIMESTAMPTZ              -- Dernière mise à jour
);

-- Contrainte unique pour éviter les doublons
UNIQUE(user_id, level_id)
```

---

## 📝 Code Modifié

### `src/features/story/useStoryProgression.ts`

#### Avant (❌ Seulement localStorage)
```typescript
useEffect(() => {
  const saved = localStorage.getItem('bertrand-story-progress');
  if (saved) {
    setLevels(JSON.parse(saved));
  }
}, []);

const completeLevel = (levelId: string) => {
  // Mise à jour locale uniquement
  setLevels(...);
};
```

#### Après (✅ Supabase + localStorage)
```typescript
useEffect(() => {
  async function loadLevels() {
    // 1. Charger depuis Supabase (source de vérité)
    const dbLevels = await fetchUserProgression();
    
    if (dbLevels && dbLevels.length > 0) {
      setLevels(dbLevels);
      localStorage.setItem('...', JSON.stringify(dbLevels));
    } else {
      // Fallback sur localStorage
      const saved = localStorage.getItem('...');
      if (saved) setLevels(JSON.parse(saved));
    }
  }
  loadLevels();
}, []);

const completeLevel = async (levelId: string) => {
  // 1. Sauvegarder dans Supabase
  await completeLevelAction(levelId);
  
  // 2. Mise à jour locale
  setLevels(...);
  localStorage.setItem('...', JSON.stringify(...));
};
```

---

## 🔍 Vérification

### 1. Vérifier dans Supabase

```sql
-- Voir la progression d'un utilisateur
SELECT 
  ulp.user_id,
  l.title as level_title,
  ulp.is_completed,
  ulp.updated_at
FROM user_level_progress ulp
JOIN levels l ON l.id = ulp.level_id
WHERE ulp.user_id = 'YOUR_USER_ID'
ORDER BY l.order_index;
```

### 2. Tester dans l'App

```
1. Jouer un niveau (ex: Hermione)
2. Gagner la partie
3. Voir le message: ✅ Niveau complété sauvegardé dans Supabase
4. Console logs:
   └── "✅ Niveau complété sauvegardé dans Supabase: level-hermione-1"
```

### 3. Vérifier la Persistance

```
1. Compléter un niveau
2. Rafraîchir la page (F5)
3. Vérifier que le niveau est toujours marqué "Complété"
4. Effacer localStorage
5. Rafraîchir
6. Le niveau doit TOUJOURS être "Complété" (chargé depuis DB)
```

---

## 🎯 Avantages

### Double Sauvegarde (Hybrid)

| Méthode | Vitesse | Persistance | Sync Multi-Device |
|---------|---------|-------------|-------------------|
| **localStorage** | ⚡ Instantané | ❌ Local only | ❌ Non |
| **Supabase** | 🌐 ~100ms | ✅ Permanent | ✅ Oui |
| **Les Deux** | ⚡ UI rapide | ✅ Backup DB | ✅ Sync |

### Bénéfices

```
✅ UI réactive (localStorage)
✅ Données persistantes (Supabase)
✅ Sync multi-appareils
✅ Fallback si DB inaccessible
✅ Cache pour accès hors ligne
✅ Source de vérité centralisée
```

---

## 🐛 Debug

### Console Logs Ajoutés

```typescript
// Au chargement
"✅ Progression chargée depuis Supabase: 2 niveaux"
"📦 Progression chargée depuis localStorage"
"🆕 Première visite - niveaux par défaut"

// À la complétion
"✅ Niveau complété sauvegardé dans Supabase: level-hermione-1"
"⚠️ Échec de la sauvegarde dans Supabase, sauvegarde locale uniquement"
```

### Si la Sauvegarde Échoue

La progression est quand même **sauvegardée localement**, permettant de continuer à jouer. La DB sera synchronisée à la prochaine action réussie.

---

## 📊 Requêtes Utiles

### Statistiques par Utilisateur
```sql
SELECT 
  user_id,
  COUNT(*) as levels_completed
FROM user_level_progress
WHERE is_completed = true
GROUP BY user_id
ORDER BY levels_completed DESC;
```

### Taux de Complétion par Niveau
```sql
SELECT 
  l.title,
  COUNT(CASE WHEN ulp.is_completed THEN 1 END) as completions,
  COUNT(DISTINCT ulp.user_id) as total_users,
  ROUND(COUNT(CASE WHEN ulp.is_completed THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(DISTINCT ulp.user_id), 0) * 100, 2) as completion_rate
FROM levels l
LEFT JOIN user_level_progress ulp ON ulp.level_id = l.id
GROUP BY l.id, l.title
ORDER BY l.order_index;
```

### Activité Récente
```sql
SELECT 
  l.title,
  ulp.user_id,
  ulp.updated_at
FROM user_level_progress ulp
JOIN levels l ON l.id = ulp.level_id
WHERE ulp.is_completed = true
ORDER BY ulp.updated_at DESC
LIMIT 10;
```

---

## ✅ Résultat Final

```
✅ Progression chargée depuis Supabase au démarrage
✅ Progression sauvegardée dans Supabase à chaque victoire
✅ Cache localStorage pour accès rapide
✅ Fallback si DB inaccessible
✅ Logs détaillés pour debug
✅ Multi-device sync automatique
✅ 0 erreur linter
```

---

## 🔄 Synchronisation Multi-Devices

```
Device 1 (PC):
└── Jouer niveau Hermione → Sauvegarder dans Supabase

Device 2 (Tablette):
└── Ouvrir l'app → Charger depuis Supabase → ✓ Hermione complété !
```

---

**🎉 La progression est maintenant entièrement synchronisée avec votre base de données Supabase ! 🗄️✨**
