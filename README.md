# 🏰 Le Grimoire Éveillé - Jeu de Rôle Conversationnel Harry Potter

Application Next.js immersive où vous dialoguez avec les personnages de Poudlard pour accomplir des missions narratives. Propulsé par l'IA OpenAI GPT-4o-mini.

## ✨ Fonctionnalités

### **Système de Jeu RPG**
- 🎭 **Dialogues IA Dynamiques** - Conversations réalistes avec des personnages Harry Potter
- 🎯 **Missions Narratives** - Chaque niveau a des objectifs uniques à atteindre
- 😊 **États Émotionnels** - Les personnages réagissent à vos choix (triste, heureux, en colère...)
- 🎲 **Système de Tours** - Limite de 10 tours pour accomplir votre mission
- 🔮 **Mots Secrets** - Découvrez des mots spéciaux pour des fins alternatives
- 🏆 **Progression Sauvegardée** - Votre avancement est enregistré dans Supabase

### **Personnages Disponibles**
- 📚 **Hermione Granger** - Bibliothèque de Poudlard
- 🐻 **Hagrid** - La Cabane mystérieuse
- ♟️ **Ron Weasley** - Salle Commune
- 🌙 **Luna Lovegood** - Le Mystère des Nargoles

### **Interface Utilisateur** ⭐
- 🎨 **Thème Médiéval/Sorcier** - Design parchemin, or ancien, cuir
- 🖼️ **Avatars Dynamiques** - Expressions faciales selon l'humeur du personnage
- 📜 **Sidebar Magique** - Navigation élégante et immersive
- 🌍 **Multilingue** - Support FR/EN complet
- 📊 **PostHog Analytics** - Suivi des événements de jeu
- 🔐 **Clerk Auth** - Authentification utilisateur sécurisée

### **Administration**
- ➕ **Création de Niveaux** - Interface admin pour ajouter de nouveaux personnages
- 📝 **Configuration JSON** - Définissez l'humeur, la localisation, les conditions de victoire
- ✅ **Activation Dynamique** - Activez/désactivez les niveaux en temps réel

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm, yarn ou pnpm
- Compte Supabase (base de données)
- Clé API OpenAI
- Compte Clerk (authentification)
- Compte PostHog (analytics - optionnel)

### Installation

1. **Cloner le repository**
```bash
git clone <your-repo-url>
cd my-app
```

2. **Installer les dépendances**
```bash
pnpm install
# ou npm install / yarn install
```

3. **Configurer les variables d'environnement**

Créer `.env.local` :
```env
# OpenAI
NEXT_PUBLIC_OPENAI_KEY=sk-your-openai-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# PostHog (optionnel)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

4. **Configurer la base de données Supabase**

Exécuter les scripts SQL dans `database/` :
```bash
# 1. Créer les tables
database/schema_conversations.sql

# 2. Insérer les niveaux
database/seed.sql
```

Voir [database/README.md](./database/README.md) pour plus de détails.

5. **Lancer le serveur de développement**
```bash
pnpm dev
```

6. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du Projet

```
src/
├── app/                                    # Pages Next.js (App Router)
│   ├── layout.tsx                         # Layout racine avec fonts
│   ├── page.tsx                           # Page d'accueil (sélection niveau)
│   ├── game/                              # Page de jeu RPG
│   │   ├── page.tsx                      # Interface de dialogue
│   │   └── layout.tsx                    # Layout immersif
│   ├── admin/                             # Interface administration
│   │   └── levels/new/page.tsx           # Création de niveau
│   ├── globals.css                        # Styles globaux + thème médiéval
│   └── providers.tsx                      # Providers (Clerk, PostHog, etc.)
│
├── features/                               # Fonctionnalités par domaine
│   ├── game/                              # Logique de jeu
│   │   ├── actions/                      # Server Actions
│   │   │   ├── game-actions.ts          # Actions de conversation
│   │   │   ├── conversation-actions.ts  # Historique
│   │   │   └── progression-actions.ts   # Progression utilisateur
│   │   ├── components/                   # Composants jeu
│   │   │   └── StoryProgress.tsx        # Barre de progression
│   │   ├── hooks/                        # Hooks personnalisés
│   │   │   └── useStoryProgression.ts   # Gestion progression
│   │   ├── data.ts                       # Données hardcodées (fallback)
│   │   └── types.ts                      # Types TypeScript
│   │
│   ├── analytics/                         # PostHog Analytics
│   │   ├── provider.tsx                  # Provider PostHog
│   │   └── events.ts                     # Tracking d'événements
│   │
│   └── levels/                            # Gestion des niveaux
│       └── level.ts                       # Types et schemas
│
├── shared/                                 # Code partagé
│   ├── components/                        # Composants réutilisables
│   │   ├── layout/                       # Layout
│   │   │   ├── Navbar.tsx               # Navbar
│   │   │   ├── NavbarResponsive.tsx     # Navbar mobile
│   │   │   ├── Sidebar.tsx              # Sidebar médiévale
│   │   │   ├── Footer.tsx               # Footer thématique
│   │   │   └── LayoutContent.tsx        # Content wrapper
│   │   └── ui/                           # Composants UI
│   │       ├── Button.tsx               # Boutons thématiques
│   │       ├── Input.tsx                # Inputs médiévaux
│   │       ├── Snackbar.tsx             # Notifications
│   │       ├── Loader.tsx               # Chargement
│   │       ├── LanguageToggle.tsx       # Sélecteur langue
│   │       └── ...
│   │
│   ├── hooks/                             # Hooks partagés
│   │   ├── useGameSession.ts            # Session de jeu
│   │   ├── useSidebar.tsx               # Sidebar state
│   │   ├── useSnackbar.ts               # Notifications
│   │   └── useMediaQuery.ts             # Responsive
│   │
│   ├── providers/                         # Providers React
│   │   └── LanguageContext.tsx          # Contexte i18n (FR/EN)
│   │
│   ├── services/                          # Services
│   │   └── openai.service.ts            # Service OpenAI
│   │
│   ├── lib/                               # Librairies
│   │   └── supabase.ts                  # Client Supabase
│   │
│   └── types/                             # Types globaux
│       └── index.ts                      # Interfaces TypeScript
│
└── public/                                 # Assets statiques
    ├── hermione/                          # Images Hermione
    │   ├── neutral.jpg
    │   ├── happy.jpg
    │   ├── sad.jpg
    │   ├── angry.jpg
    │   └── desperate.jpg
    ├── hagrid/                            # Images Hagrid
    ├── ron/                               # Images Ron (PNG)
    ├── luna/                              # Images Luna (PNG)
    ├── logoGrimoire.png                   # Logo principal
    └── backgroundImage.png                # Background médiéval
```

## 🎯 Fonctionnalités Détaillées

### Système de Jeu RPG

**Objectif :** Dialoguez avec un personnage pour l'aider à résoudre un problème émotionnel ou atteindre un objectif.

**Mécanique :**
1. Chaque niveau a un personnage unique (Hermione, Hagrid, Ron, Luna)
2. Le personnage a une **humeur initiale** (triste, nerveux, neutre)
3. Votre conversation influence son **risque de départ** (0-100%)
4. Vous avez **10 tours maximum** pour réussir la mission
5. **Victoire** si le personnage est convaincu (risque proche de 0%)
6. **Défaite** si le personnage part ou après 10 tours

**Mots Secrets :**
- `youpi` / `yay` : Victoire instantanée
- `moldu` / `muggle` : Défaite instantanée (insulte magique)

### Système de Progression

**Base de données Supabase :**
- Table `levels` : Tous les niveaux disponibles
- Table `user_level_progress` : Progression par utilisateur
- Authentification via Clerk (userId)

**Logique de déverrouillage :**
1. Le premier niveau est toujours déverrouillé
2. Compléter un niveau déverrouille le suivant
3. Les niveaux complétés affichent un badge **or brillant** ✨
4. Les niveaux disponibles affichent un badge **bronze**
5. Les niveaux verrouillés sont grisés 🔒

### Thème Visuel Médiéval

**Palette de couleurs :**
- Background : `#0E1320` (bleu nuit sombre)
- Surface : `#141B2D` (cartes/panels)
- Border : `#3A2F1E` (brun ancien)
- Parchment : `#E6D5A7` (texte or/parchemin)
- Gold : `#C9A227` (accents dorés)
- Bronze : `#8C6A3F` (disponible)
- Leather : `#6B4F2F` (cuir sombre)

**Typographies :**
- Titres : `Cinzel` (médiéval élégant)
- Texte : `Merriweather` (lisible, serif)

**Effets :**
- Background image fixe avec overlays
- Ombres profondes et dorées
- Animations shimmer sur l'or
- Backdrop blur pour transparence

### Analytics PostHog

**Événements trackés :**
- `game_started` : Début d'un niveau
- `message_sent` : Message envoyé dans le jeu
- `game_ended` : Fin de partie (victoire/défaite)
- `secret_word_used` : Utilisation mot secret
- `level_navigation` : Navigation entre niveaux
- `language_changed` : Changement de langue

## 🎨 Technologies

- **Next.js 16.0.3** - Framework React avec App Router
- **TypeScript 5** - Typage statique
- **Tailwind CSS 4** - Styles utilitaires + thème personnalisé
- **OpenAI GPT-4o-mini** - Intelligence artificielle conversationnelle
- **Supabase** - Base de données PostgreSQL + Auth
- **Clerk** - Authentification utilisateur (GitHub, Google, Email)
- **PostHog** - Analytics et feature flags
- **React Hook Form + Zod** - Formulaires avec validation
- **Next/Image** - Optimisation d'images

## 🛠️ Scripts Disponibles

```bash
# Développement (Turbopack)
pnpm dev

# Build de production
pnpm build

# Démarrer en production
pnpm start

# Linter
pnpm lint

# Vérification de sécurité (API keys)
pnpm run check-secrets
```

## 📚 Documentation

- [database/README.md](./database/README.md) - Configuration Supabase
- [documentation/STRUCTURE_GUIDE.md](./documentation/STRUCTURE_GUIDE.md) - Architecture complète
- [documentation/PROGRESSION_SYSTEM.md](./documentation/PROGRESSION_SYSTEM.md) - Système de progression
- [documentation/POSTHOG_SETUP.md](./documentation/POSTHOG_SETUP.md) - Configuration analytics
- [documentation/CLERK_SETUP.md](./documentation/CLERK_SETUP.md) - Configuration auth

## 🐛 Problèmes Courants

### "API Key not configured"
→ Vérifiez `.env.local` et votre clé OpenAI

### "Supabase connection failed"
→ Vérifiez vos credentials Supabase dans `.env.local`

### "User not authenticated"
→ Configurez Clerk correctement et connectez-vous

### Images manquantes
→ Ajoutez les images des personnages dans `/public/{character}/`

### Niveau ne se déverrouille pas
→ Vérifiez la table `user_level_progress` dans Supabase

## 🎮 Créer un Nouveau Niveau

1. **Ajouter les images** dans `/public/{character-name}/` :
   - `neutral.png/jpg`
   - `happy.png/jpg`
   - `sad.png/jpg`
   - `angry.png/jpg`
   - `desperate.png/jpg`

2. **Configurer la détection** dans :
   - `src/app/page.tsx` (cards homepage)
   - `src/app/game/page.tsx` (page de jeu)

3. **Ajouter les traductions** dans :
   - `src/shared/providers/LanguageContext.tsx`
   - Clés : `level.{character}.title` et `level.{character}.description`

4. **Créer le niveau via l'admin** :
   - `/admin/levels/new`
   - Remplir : titre, description, ordre, JSON content

**Format JSON content :**
```json
{
  "character": "Nom du Personnage",
  "initial_mood": "neutral",
  "location": "Lieu à Poudlard",
  "initial_message": "Message d'ouverture...",
  "objective": "Objectif de la mission",
  "difficulty": "medium",
  "win_conditions": ["Condition 1", "Condition 2"],
  "lose_conditions": ["Condition 1", "Condition 2"],
  "suggested_actions": ["Action 1", "Action 2", "Action 3", "Action 4"]
}
```

## 🔒 Sécurité

### Variables d'Environnement

**✅ Fichiers ignorés par Git :**
- `.env.local` (vos clés API)
- `.env`

**⚠️ Ne JAMAIS commiter :**
- Clés API OpenAI
- Credentials Supabase
- Secrets Clerk
- Tokens PostHog

### Base de données

- Row Level Security (RLS) activé sur Supabase
- Authentification Clerk requise pour toutes les actions
- userId lié à chaque progression

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouveau-personnage`)
3. Commit vos changements (`git commit -m 'Ajout de Dumbledore'`)
4. Push vers la branche (`git push origin feature/nouveau-personnage`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Développé avec passion pour l'univers Harry Potter ✨

## 🙏 Remerciements

- J.K. Rowling pour l'univers Harry Potter
- OpenAI pour l'API GPT
- Supabase team
- Clerk team
- PostHog team
- La communauté Next.js

---

**Fait avec 🪄 magie et ⚡ intelligence artificielle**

*"Les mots sont, à mon humble avis, notre plus inépuisable source de magie."* - Albus Dumbledore
