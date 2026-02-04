# 🗂️ Guide de la Nouvelle Structure

## 📁 **Vue d'Ensemble**

```
src/
├── app/                 # 🌐 Pages & Routes (Next.js)
├── features/            # 🎯 Code Métier (par feature)
├── shared/              # 🧩 Code Partagé (infrastructure)
└── config/              # ⚙️ Configuration
```

---

## 🎯 **Principe: Feature-First**

Chaque **feature** est **autonome** et contient tout son code :
- Actions (server actions)
- Components (composants spécifiques)
- Hooks (hooks spécifiques)
- Types (types TypeScript)
- Utils (utilitaires)

**Avantage:** Pour modifier une feature, tout est au même endroit !

---

## 📖 **Guide par Dossier**

### 🌐 **app/** - Next.js App Router

```
app/
├── game/                # 🎮 Page du jeu RPG
│   ├── layout.tsx       # Layout avec Sidebar + Footer
│   └── page.tsx         # Jeu principal
│
├── admin/               # 👤 Pages d'administration
│   └── levels/
│       └── new/
│           └── page.tsx # Formulaire création niveau
│
├── api/                 # 🔌 API Routes
│   └── levels/
│       └── route.ts     # GET/POST niveaux
│
├── test-db/             # 🧪 Diagnostic Supabase
│   └── page.tsx
│
├── themes/              # 🎨 CSS des thèmes
│   └── minimal.css
│
├── layout.tsx           # Layout racine
├── providers.tsx        # Providers globaux
├── page.tsx             # Page d'accueil
└── globals.css          # CSS global
```

**Quoi mettre ici ?**
- ✅ Pages et routes
- ✅ Layouts
- ✅ API routes
- ❌ Logique métier (→ `features/`)
- ❌ Composants réutilisables (→ `shared/components/`)

---

### 🎯 **features/** - Code Métier

```
features/
├── game/                        # 🎮 Feature: Jeu RPG
│   ├── actions/                 # Server actions du jeu
│   │   ├── game-actions.ts      # playTurn() - OpenAI
│   │   ├── progression-actions.ts # fetchUserProgression(), completeLevelAction()
│   │   └── conversation-actions.ts # createGameSession(), saveConversationMessage()
│   │
│   ├── components/              # Composants spécifiques au jeu
│   │   └── StoryProgress.tsx    # Affichage de la progression
│   │
│   ├── hooks/                   # Hooks spécifiques au jeu
│   │   └── useStoryProgression.ts # Gestion de la progression
│   │
│   ├── types.ts                 # Types: StoryLevel, LevelStatus
│   └── data.ts                  # Data statique (niveaux hardcodés)
│
├── levels/                      # 📚 Feature: Gestion des niveaux
│   ├── actions/                 # Server actions des niveaux (vide pour l'instant)
│   ├── components/              # Composants (LevelCard, LevelForm à créer)
│   └── level.ts                 # Validations Zod pour les niveaux
│
└── analytics/                   # 📊 Feature: Analytics PostHog
    ├── provider.tsx             # PosthogProvider
    └── events.ts                # trackGameStart(), trackMessageSent()...
```

**Quoi mettre ici ?**
- ✅ Code métier spécifique à une feature
- ✅ Actions, components, hooks, types de la feature
- ✅ Logique business
- ❌ Code réutilisable (→ `shared/`)

**Règle:** Si tu supprimes une feature, tu supprimes juste son dossier !

---

### 🧩 **shared/** - Code Partagé

```
shared/
├── components/
│   ├── layout/                  # Composants de layout
│   │   ├── Navbar.tsx
│   │   ├── NavbarResponsive.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── LayoutContent.tsx
│   │
│   └── ui/                      # UI Primitives (Design System)
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── TextArea.tsx
│       ├── Snackbar.tsx
│       ├── Loader.tsx
│       ├── LanguageToggle.tsx
│       └── ...
│
├── hooks/                       # Hooks génériques
│   ├── useSnackbar.ts          # Gestion des notifications
│   ├── useSidebar.tsx          # État de la sidebar
│   ├── useMediaQuery.ts        # Responsive design
│   └── useGameSession.ts       # Gestion des sessions de jeu
│
├── providers/                   # Providers globaux
│   └── LanguageContext.tsx     # Context i18n (fr/en)
│
├── lib/                         # Utilitaires & Helpers
│   └── supabase.ts             # Client Supabase
│
├── services/                    # Services externes
│   └── openai.service.ts       # (si besoin d'un service générique OpenAI)
│
└── types/                       # Types globaux
    └── index.ts                # GameState, ChatMessage, etc.
```

**Quoi mettre ici ?**
- ✅ Code réutilisable entre plusieurs features
- ✅ UI primitives (Button, Input, etc.)
- ✅ Hooks génériques (useSnackbar, useMediaQuery)
- ✅ Providers globaux (LanguageContext)
- ❌ Code spécifique à une feature (→ `features/`)

---

### ⚙️ **config/** - Configuration

```
config/
├── site.ts              # Config du site (à créer)
└── routes.ts            # Routes de l'app (à créer)
```

**Exemples de contenu:**

```typescript
// config/site.ts
export const siteConfig = {
  name: "Le Grimoire Éveillé",
  description: "Jeu de rôle interactif dans l'univers Harry Potter",
  url: "https://grimoire-eveille.com",
  links: {
    github: "...",
  },
};

// config/routes.ts
export const routes = {
  home: "/",
  game: "/game",
  admin: "/admin/levels/new",
  testDb: "/test-db",
};
```

---

## 🧭 **Chemins d'Import**

### Avant la Migration

```typescript
import { playTurn } from '@/actions/game-actions';
import { Snackbar } from '@/components/ui/Snackbar';
import { useStoryProgression } from '@/features/story/useStoryProgression';
import { useLanguage } from '@/context/LanguageContext';
```

### Après la Migration ✅

```typescript
import { playTurn } from '@/features/game/actions/game-actions';
import { Snackbar } from '@/shared/components/ui/Snackbar';
import { useStoryProgression } from '@/features/game/hooks/useStoryProgression';
import { useLanguage } from '@/shared/providers/LanguageContext';
```

**Avantage:** On sait **immédiatement** si c'est du code métier (features) ou infrastructure (shared).

---

## 📋 **Règles de Décision**

### Où Mettre un Nouveau Fichier ?

```
1. C'est spécifique au jeu RPG ?
   → features/game/

2. C'est spécifique à la gestion des niveaux ?
   → features/levels/

3. C'est un composant UI générique (Button, Modal, etc.) ?
   → shared/components/ui/

4. C'est un composant de layout (Navbar, Footer) ?
   → shared/components/layout/

5. C'est un hook générique (useDebounce, useLocalStorage) ?
   → shared/hooks/

6. C'est un provider global (Theme, Auth) ?
   → shared/providers/

7. C'est un utilitaire général (formatDate, cn) ?
   → shared/lib/

8. C'est de la configuration ?
   → config/
```

---

## 🎨 **Exemple: Ajouter une Feature "Achievements"**

```bash
# 1. Créer la structure
mkdir -p src/features/achievements/{actions,components,hooks}

# 2. Ajouter les fichiers
src/features/achievements/
├── actions/
│   ├── unlock-achievement.ts
│   └── get-achievements.ts
├── components/
│   ├── AchievementList.tsx
│   └── AchievementBadge.tsx
├── hooks/
│   └── useAchievements.ts
└── types.ts

# 3. Ajouter la page
src/app/achievements/page.tsx

# 4. Importer depuis la feature
import { useAchievements } from '@/features/achievements/hooks/useAchievements';
```

---

## 🔍 **Exemples de Navigation**

### Trouver le Code du Jeu

```bash
cd src/features/game/
ls -la

actions/              # Server actions
components/           # Composants du jeu
hooks/                # Hooks du jeu
types.ts              # Types
data.ts               # Data
```

### Trouver les Composants UI

```bash
cd src/shared/components/ui/
ls -la

Button.tsx
Input.tsx
Snackbar.tsx
...
```

### Trouver les Événements PostHog

```bash
cd src/features/analytics/
ls -la

provider.tsx          # PosthogProvider
events.ts             # trackGameStart(), etc.
```

---

## ✅ **Checklist pour Nouveaux Développeurs**

- [ ] Lire `STRUCTURE_GUIDE.md` (ce fichier)
- [ ] Comprendre la différence entre `features/` et `shared/`
- [ ] Connaître les conventions d'import
- [ ] Savoir où créer un nouveau fichier
- [ ] Suivre le principe Feature-First

---

## 📊 **Comparaison Avant/Après**

| Aspect | Avant | Après |
|--------|-------|-------|
| **Dossiers racine** | 12 | 4 |
| **Profondeur max** | 3-4 niveaux | 2-3 niveaux |
| **Temps de recherche** | ~30s | ~5s |
| **Compréhension** | Difficile | Facile |
| **Maintenance** | Complexe | Simple |
| **Scalabilité** | Limitée | Excellente |

---

**🎯 Votre codebase est maintenant organisée comme les projets professionnels !**
