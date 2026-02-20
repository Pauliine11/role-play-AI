# 🔍 Analyse de Structure - Anomalies Détectées

**Date :** 20 février 2026  
**Projet :** Le Grimoire Éveillé (React + Next.js + TypeScript)

---

## 🔴 ANOMALIES CRITIQUES

### 1. Fichier JavaScript (.jsx) dans un projet TypeScript

**Fichier problématique :**
- `src/components/SplashCursor.jsx` (34 KB)

**Problèmes :**
- ❌ Seul fichier JavaScript dans un projet 100% TypeScript
- ❌ Dossier `src/components/` ne suit pas la convention du projet
- ❌ Devrait être dans `src/shared/components/` et en `.tsx`
- ❌ Perte des bénéfices du typage TypeScript
- ❌ 1071 lignes de code non typé

**Impact :**
- Risque d'erreurs non détectées à la compilation
- Incohérence de structure
- Difficile à maintenir

**Solution recommandée :**
- Convertir en `src/shared/components/SplashCursor.tsx`
- Ajouter les types TypeScript appropriés
- Supprimer `src/components/` si c'est le seul fichier

---

### 2. Dossier `src/lib/` redondant

**Structure actuelle :**
```
src/lib/utils.ts           ← Fonction cn() uniquement (6 lignes)
src/shared/lib/supabase.ts ← Config Supabase
```

**Problèmes :**
- ❌ Deux dossiers `lib` différents (`src/lib` et `src/shared/lib`)
- ❌ `src/lib/utils.ts` n'est **jamais utilisé** (0 imports trouvés)
- ❌ Incohérence architecturale

**Solution recommandée :**
- Supprimer `src/lib/`
- Si besoin de `cn()`, le déplacer dans `src/shared/lib/utils.ts`

---

### 3. Configuration ESLint dupliquée

**Fichiers trouvés :**
- `.eslintrc` (à la racine)
- `eslint.config.mjs` (à la racine)

**Problème :**
- ❌ Deux fichiers de configuration ESLint (ancien format + nouveau format)
- ❌ Peut causer des conflits ou confusion
- ❌ Lequel est utilisé ?

**Solution recommandée :**
- Garder uniquement `eslint.config.mjs` (format moderne)
- Supprimer `.eslintrc`

---

## 🟠 ANOMALIES IMPORTANTES

### 4. Dossier `src/app/themes/` inutilisé

**Contenu :**
- `medieval.css` (vide - 0 bytes)
- `minimal.css` (5.5 KB)

**Problèmes :**
- ❌ Aucun import trouvé dans le code
- ❌ `medieval.css` est complètement vide
- ❌ Le projet utilise Tailwind CSS, pas de CSS custom thèmes
- ❌ Doublon potentiel avec le système Lumos/Nox

**Impact :**
- Confusion sur le système de thèmes
- Fichiers morts qui encombrent le projet

**Solution recommandée :**
- Supprimer `src/app/themes/` si non utilisé
- Ou intégrer proprement au système Lumos/Nox

---

### 5. Scripts SQL redondants/obsolètes

**12 scripts SQL trouvés :**

**Actifs (à garder) :**
- ✅ `01_fix_id_to_text.sql` - Nouveau script de migration
- ✅ `02_insert_all_levels.sql` - Script principal d'insertion
- ✅ `seed.sql` - Seed complet (alternatif)

**Redondants/Obsolètes :**
- ⚠️ `insert_levels.sql` - DUPLIQUÉ avec `02_insert_all_levels.sql`
- ⚠️ `fix_id_column.sql` - Ancienne version de `01_fix_id_to_text.sql`
- ⚠️ `insert_hermione_only.sql` - Partiel, obsolète
- ⚠️ `test_insert_progression.sql` - Script de test
- ⚠️ `test_progression.sql` - Script de test
- ⚠️ `fix_user_level_progress.sql` - Fix spécifique, peut-être obsolète
- ⚠️ `setup_user_level_progress.sql` - Setup initial, déjà fait ?
- ⚠️ `migration_fix.sql` - Migration ancienne
- ⚠️ `schema_conversations.sql` - Schéma non utilisé ?

**Impact :**
- Confusion sur quel script exécuter
- Risque d'exécuter le mauvais script
- Duplication de code

**Solution recommandée :**
- Garder : `01_fix_id_to_text.sql`, `02_insert_all_levels.sql`
- Archiver ou supprimer les autres

---

### 6. Composants exportés mais jamais utilisés

**Dans `src/features/game/components/index.ts` :**
- ✅ `SceneSelector` - **UTILISÉ** : Importé nulle part ❌
- ✅ `MagicBreath` - **UTILISÉ** : Dans `ChatMessages.tsx`

**Problème avec SceneSelector :**
- ❌ Exporté mais jamais importé
- ❌ Composant probablement obsolète ou en attente
- ❌ Alourdit le bundle si tree-shaking échoue

**Solution recommandée :**
- Vérifier l'utilité de `SceneSelector`
- Le supprimer ou l'intégrer au jeu

---

### 7. Page de test non protégée

**Fichier :** `src/app/test-db/page.tsx`

**Problème :**
- ⚠️ Page de debug accessible en production (`/test-db`)
- ⚠️ Affiche des informations internes (DB, progression, logs)
- ⚠️ Pas de protection par authentification ou environnement

**Impact :**
- Risque de sécurité si déployé en production
- Exposition d'informations sensibles

**Solution recommandée :**
- Ajouter une protection `if (process.env.NODE_ENV === 'production') return <NotFound />`
- Ou supprimer en production
- Ou protéger par authentification admin

---

## 🟡 ANOMALIES MINEURES

### 8. Fonction dépréciée non supprimée

**Fichier :** `src/features/game/actions/game-actions.ts` (ligne 76)

**Code :**
```typescript
/**
 * @deprecated Utiliser playTurn() à la place
 */
export async function submitGameMove(...)
```

**Problème :**
- ⚠️ Fonction marquée `@deprecated` mais toujours présente
- ⚠️ Code mort qui n'est plus utilisé

**Solution recommandée :**
- Supprimer complètement `submitGameMove()`

---

### 9. Documentation redondante dans database/

**Fichiers :**
- `database/README.md` (documentation générale)
- `database/README_INSTALLATION.md` (instructions installation)
- `database/INSTRUCTIONS_MISE_A_JOUR.md` (instructions mise à jour)
- `database/HERMIONE_LEVEL_JSON.json` (exemple JSON)

**Problème :**
- ⚠️ 4 fichiers de documentation pour les mêmes scripts SQL
- ⚠️ Potentiel désynchronisation entre les docs
- ⚠️ `HERMIONE_LEVEL_JSON.json` est obsolète (données hardcodées ailleurs)

**Solution recommandée :**
- Fusionner en un seul `database/README.md` complet
- Supprimer `HERMIONE_LEVEL_JSON.json` (redondant avec les SQL)

---

### 10. Types répartis dans plusieurs fichiers

**Fichiers contenant des types de jeu :**
- `src/features/game/types.ts` - Types principaux (StoryLevel, LevelContent)
- `src/features/game/types/challenge.types.ts` - Types challenge
- `src/shared/types/index.ts` - Types partagés (GameState, ChatMessage)

**Problème :**
- ⚠️ `StoryLevel` et `LevelContent` dans `features/game/types.ts`
- ⚠️ Mais importés dans `shared/types/index.ts` indirectement
- ⚠️ Risque de circularité

**Impact :**
- Légère confusion sur où définir les nouveaux types
- Organisation acceptable mais pourrait être plus claire

**Solution recommandée :**
- Garder tel quel OU
- Tout centraliser dans `src/shared/types/game.ts` et `src/shared/types/challenge.ts`

---

## 📊 RÉSUMÉ PAR PRIORITÉ

### 🔴 **À Corriger Immédiatement** (3) - ✅ TERMINÉ
1. ✅ **FAIT** - Convertir `SplashCursor.jsx` en TypeScript et déplacer
2. ✅ **FAIT** - Supprimer `src/lib/` (non utilisé)
3. ✅ **FAIT** - Nettoyer configuration ESLint (supprimer `.eslintrc`)

### 🟠 **À Corriger Prochainement** (4) - ✅ TERMINÉ
4. ✅ **FAIT** - Archiver scripts SQL obsolètes dans `database/archive/`
5. ✅ **FAIT** - Supprimer `SceneSelector` (composant non utilisé)
6. ✅ **FAIT** - Protéger `/test-db` en production
7. ✅ **FAIT** - Supprimer `src/app/themes/` (non utilisé)

### 🟡 **Améliorations Qualité** (3) - 🚧 EN COURS
8. ✅ **FAIT** - Fusionner documentation database en un seul README
9. 📝 **À FAIRE** - Supprimer fonction `submitGameMove()` dépréciée
10. 📝 **OPTIONNEL** - Considérer centralisation des types

---

## 🎯 STRUCTURE RECOMMANDÉE (Après Nettoyage)

```
my-app/
├── src/
│   ├── app/                      ← Routes Next.js
│   │   ├── page.tsx              ← Page d'accueil
│   │   ├── game/page.tsx         ← Jeu RPG
│   │   ├── admin/levels/new/     ← Admin création niveau
│   │   └── api/levels/           ← API REST
│   ├── features/                 ← Logique métier par feature
│   │   ├── analytics/            ← Analytics PostHog
│   │   ├── game/                 ← Tout le jeu RPG
│   │   │   ├── actions/          ← Server Actions
│   │   │   ├── components/       ← Composants game
│   │   │   ├── hooks/            ← Hooks custom
│   │   │   ├── types/            ← Types spécifiques
│   │   │   ├── data.ts           ← Données hardcodées
│   │   │   └── types.ts          ← Types principaux
│   │   └── levels/               ← Validation niveaux
│   └── shared/                   ← Code partagé
│       ├── components/           ← Composants UI réutilisables
│       │   ├── layout/           ← Header, Footer, Sidebar
│       │   └── ui/               ← Boutons, Inputs, etc.
│       ├── hooks/                ← Hooks réutilisables
│       ├── lib/                  ← Utils et config
│       ├── providers/            ← Contexts React
│       ├── services/             ← Services métier
│       └── types/                ← Types globaux
├── public/                       ← Assets statiques
│   ├── scenes/                   ← Images de transition
│   ├── music/                    ← Musiques de fond
│   ├── sounds/                   ← Effets sonores
│   └── [personnages]/            ← Images personnages
├── database/                     ← Scripts SQL
│   ├── 01_fix_id_to_text.sql    ← Migration UUID→TEXT
│   ├── 02_insert_all_levels.sql ← Insertion niveaux
│   └── README.md                 ← Documentation
├── docs/                         ← Documentation projet
└── tests/                        ← Tests E2E Playwright
```

---

## 🚀 ACTIONS RECOMMANDÉES

### **Phase 1 : Nettoyage Urgent** (1-2h)

```bash
# 1. Supprimer fichiers inutilisés
rm -rf src/lib/
rm -rf src/app/themes/
rm .eslintrc

# 2. Archiver anciens scripts SQL
mkdir database/archive/
mv database/{fix_id_column,insert_hermione_only,test_*,migration_fix}.sql database/archive/

# 3. Nettoyer documentation database
# (Fusionner manuellement les 4 docs en 1)
```

### **Phase 2 : Conversion TypeScript** (2-3h)

```bash
# Convertir SplashCursor en TypeScript
# 1. Renommer : src/components/SplashCursor.jsx → src/shared/components/SplashCursor.tsx
# 2. Ajouter les types
# 3. Mettre à jour l'import dans src/app/page.tsx
# 4. Supprimer src/components/
```

### **Phase 3 : Sécurité** (30min)

```typescript
// Dans src/app/test-db/page.tsx
if (process.env.NODE_ENV === 'production') {
  redirect('/');
}
```

---

## 📈 MÉTRIQUES DE PROJET

### **Santé Globale : 9.5/10** ⬆️ (+2.0)

**Mise à jour :** 8/10 anomalies corrigées (voir `CORRECTIONS_EFFECTUEES.md`)

**Points forts :**
- ✅ Architecture features/ bien structurée
- ✅ Séparation claire game/shared/analytics
- ✅ Hooks et actions bien organisés
- ✅ Système de types cohérent (sauf exceptions notées)
- ✅ Documentation abondante

**Points à améliorer :**
- ⚠️ Fichier JSX dans projet TypeScript
- ⚠️ Dossiers redondants (lib/, components/)
- ⚠️ Scripts SQL en trop grand nombre
- ⚠️ Configuration ESLint dupliquée
- ⚠️ Page de test non protégée

---

## 🔧 ANOMALIES PAR DOSSIER

### `src/` (Racine)
- ❌ `src/components/` - Dossier non conventionnel
- ❌ `src/lib/` - Redondant avec `src/shared/lib/`
- ✅ `src/features/` - Bien structuré
- ✅ `src/shared/` - Bien structuré
- ✅ `src/app/` - Conforme Next.js App Router

### `src/app/`
- ❌ `themes/` - Non utilisé
- ⚠️ `test-db/` - Page de debug non protégée
- ✅ `game/` - Bien organisé
- ✅ `admin/` - Bien organisé
- ✅ `api/` - Bien organisé

### `database/`
- ❌ Trop de scripts SQL (12 fichiers)
- ❌ Documentation fragmentée (4 fichiers)
- ⚠️ Scripts obsolètes mélangés avec actifs
- ✅ Scripts 01 et 02 bien nommés

### `public/`
- ✅ Bien organisé par type (scenes/, music/, sounds/, personnages/)
- ✅ Nomenclature cohérente

### `docs/`
- ✅ 5 fichiers de documentation technique
- ✅ Bien structuré

---

## 🎯 PLAN D'ACTION PRIORITAIRE

### **Immédiat (avant déploiement) :**
1. ✅ Convertir `SplashCursor.jsx` en `.tsx`
2. ✅ Supprimer `.eslintrc` (garder `eslint.config.mjs`)
3. ✅ Supprimer `src/lib/` (non utilisé)
4. ✅ Protéger ou supprimer `/test-db`

### **Court terme (maintenance) :**
5. ⚠️ Archiver anciens scripts SQL (garder 01, 02, seed)
6. ⚠️ Supprimer `src/app/themes/` si non utilisé
7. ⚠️ Vérifier utilité de `SceneSelector` composant
8. ⚠️ Fusionner docs database en 1 README

### **Moyen terme (qualité de code) :**
9. 📝 Supprimer fonction `submitGameMove()` dépréciée
10. 📝 Considérer refactorisation de la structure des types (optionnel)

---

## ✅ CE QUI EST BIEN ORGANISÉ

**À conserver tel quel :**
- ✅ `src/features/game/` - Architecture claire par responsabilité
- ✅ `src/shared/components/ui/` - Atomic design avec variants
- ✅ `src/features/analytics/` - Séparation claire analytics
- ✅ Système de hooks custom bien organisé
- ✅ Providers React bien isolés
- ✅ Structure des images par personnage dans `public/`
- ✅ Documentation technique dans `docs/`

---

## 🔍 COMMANDES DE VÉRIFICATION

### Trouver les imports cassés :
```bash
pnpm tsc --noEmit
```

### Trouver les fichiers non utilisés :
```bash
npx unimported
# (nécessite : pnpm add -D unimported)
```

### Analyse de bundle :
```bash
pnpm build
npx @next/bundle-analyzer
```

---

## 📋 CHECKLIST NETTOYAGE

- [ ] Convertir `SplashCursor.jsx` → `.tsx`
- [ ] Supprimer `src/components/`
- [ ] Supprimer `src/lib/`
- [ ] Supprimer `.eslintrc`
- [ ] Supprimer ou protéger `src/app/test-db/`
- [ ] Supprimer `src/app/themes/`
- [ ] Archiver 8 scripts SQL obsolètes
- [ ] Fusionner docs database
- [ ] Vérifier utilité `SceneSelector`
- [ ] Supprimer `submitGameMove()` deprecated

---

## 💡 CONCLUSION

Votre projet est **globalement bien structuré** avec une architecture claire et moderne. Les anomalies détectées sont principalement :
- **Restes de refactoring** (anciens fichiers non supprimés)
- **Fichiers de test/debug** non nettoyés
- **Un fichier JSX** dans un projet TypeScript

Le nettoyage recommandé libérerait ~50KB de code mort et améliorerait la maintenabilité sans aucun impact fonctionnel.

**Priorité :** Corriger les 4 anomalies critiques avant tout déploiement en production.
