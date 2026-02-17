# 📊 PostHog - Setup Complet

## ✅ **Installation et Configuration**

PostHog a été configuré pour votre application Next.js avec identification des utilisateurs et tracking des événements custom.

---

## 🎯 **Architecture**

```
layout.tsx (racine)
    ↓
AppProviders
    ↓
PosthogProvider ← Initialisation UNE SEULE FOIS
    ↓ (useEffect avec deps vides)
PostHog.init() + PostHog.identify()
    ↓
Événements Custom dans le jeu
```

---

## 📁 **Fichiers Créés**

### 1. **`src/providers/PosthogProvider.tsx`**

Provider principal qui :
- ✅ **S'initialise une seule fois** au montage du composant
- ✅ **Identifie l'utilisateur** avec Clerk (email, nom, image)
- ✅ **Gère la déconnexion** (reset de l'identité)
- ✅ **Affiche des console.log** pour tracer les exécutions

**Protection contre les re-renders:**
```typescript
const hasInitialized = useRef(false);  // Init une seule fois
const hasIdentified = useRef(false);   // Identify une seule fois

useEffect(() => {
  if (hasInitialized.current) {
    console.log('🔄 PostHog: Déjà initialisé, skip');
    return;
  }
  // Initialisation...
  hasInitialized.current = true;
}, []); // ⚠️ Dépendances vides !
```

### 2. **`src/lib/posthog.ts`**

Bibliothèque d'événements custom :
- ✅ `trackGameStart()` - Début de partie
- ✅ `trackMessageSent()` - Envoi d'un message
- ✅ `trackGameEnd()` - Fin de partie (victoire/défaite)
- ✅ `trackLanguageChange()` - Changement de langue
- ✅ `trackSecretWordUsed()` - Utilisation de mot secret
- ✅ `trackLevelNavigation()` - Navigation entre niveaux

Chaque fonction affiche aussi un `console.log` pour le debug.

### 3. **`src/app/providers.tsx`**

Intègre le PosthogProvider au plus haut niveau :
```typescript
<PosthogProvider>  ← Au top !
  <QueryClientProvider>
    <LanguageProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </LanguageProvider>
  </QueryClientProvider>
</PosthogProvider>
```

### 4. **`src/app/immersive/immersive-rpg/page.tsx`**

Intégration des événements dans le jeu :
- ✅ Track au démarrage de la partie
- ✅ Track à chaque message envoyé
- ✅ Track à la fin de la partie
- ✅ Track au changement de langue
- ✅ Track à la navigation vers niveau suivant

---

## 📊 **Événements Trackés**

### 1️⃣ **`game_started`**

**Quand:** Au chargement d'un niveau  
**Données:**
```json
{
  "level_id": "level-hermione-1",
  "level_title": "Bibliothèque de Poudlard - Hermione",
  "character": "Hermione Granger",
  "timestamp": "2026-01-26T15:30:00.000Z"
}
```

### 2️⃣ **`message_sent`**

**Quand:** À chaque envoi de message  
**Données:**
```json
{
  "level_id": "level-hermione-1",
  "turn_number": 3,
  "message_length": 45,
  "departure_risk": 60,
  "timestamp": "2026-01-26T15:32:15.000Z"
}
```

### 3️⃣ **`game_ended`**

**Quand:** Victoire ou défaite  
**Données:**
```json
{
  "level_id": "level-hermione-1",
  "level_title": "Bibliothèque de Poudlard - Hermione",
  "character": "Hermione Granger",
  "result": "victory",
  "turn_count": 8,
  "final_departure_risk": 15,
  "game_duration_seconds": 245,
  "defeat_reason": null,
  "timestamp": "2026-01-26T15:35:00.000Z"
}
```

### 4️⃣ **`language_changed`**

**Quand:** Clic sur le bouton de langue  
**Données:**
```json
{
  "from_language": "fr",
  "to_language": "en",
  "timestamp": "2026-01-26T15:33:00.000Z"
}
```

### 5️⃣ **`secret_word_used`**

**Quand:** "youpi" ou "moldu" détecté  
**Données:**
```json
{
  "word": "youpi",
  "effect": "instant_victory",
  "timestamp": "2026-01-26T15:34:00.000Z"
}
```

### 6️⃣ **`level_navigation`**

**Quand:** Clic sur "Niveau Suivant"  
**Données:**
```json
{
  "from_level": "level-hermione-1",
  "to_level": "level-hagrid-1",
  "timestamp": "2026-01-26T15:36:00.000Z"
}
```

---

## 🔍 **Identification des Utilisateurs**

### Utilisateur Connecté (Clerk)

PostHog identifie automatiquement les users avec:

```typescript
posthog.identify(user.id, {
  email: user.emailAddresses[0]?.emailAddress,
  name: user.fullName || user.firstName,
  created_at: user.createdAt,
  image_url: user.imageUrl,
});
```

### Utilisateur Non Connecté

Mode anonyme activé automatiquement :
```typescript
posthog.reset(); // Reset l'identité
```

---

## 🧪 **Console Logs & Debug**

### Logs d'Initialisation

Au premier chargement de l'app :
```
🚀 PostHog: Première initialisation
⏳ PostHog: En attente du chargement de Clerk...
👤 PostHog: User identifié -> { id: 'user_xxx', email: 'test@example.com', name: 'John Doe' }
✅ PostHog: Initialisé avec succès
```

### Logs de Re-renders

Si le composant re-render :
```
🔄 PostHog: Déjà initialisé, skip
🔄 PostHog: User déjà identifié, skip
```

### Logs d'Événements

À chaque événement :
```
📊 PostHog Event: game_started { level_id: '...', character: '...' }
📊 PostHog Event: message_sent { turn: 3, departure_risk: 60 }
📊 PostHog Event: game_ended { result: 'victory', turns: 8, duration: '245s' }
```

---

## 📈 **Dashboard PostHog**

### Voir les Événements en Direct

1. Aller sur: https://eu.posthog.com
2. Onglet "Events" → Voir tous les événements en temps réel
3. Filtrer par événement (ex: `game_ended`)

### Créer des Insights

**Exemple 1: Taux de victoire**
```
Event: game_ended
Filter: result = "victory"
Groupé par: level_id
```

**Exemple 2: Durée moyenne des parties**
```
Event: game_ended
Métrique: Moyenne de game_duration_seconds
Groupé par: result
```

**Exemple 3: Tours moyens avant victoire**
```
Event: game_ended
Filter: result = "victory"
Métrique: Moyenne de turn_count
```

### Créer un Funnel

```
Étape 1: game_started
Étape 2: message_sent (turn_number >= 3)
Étape 3: game_ended (result = "victory")
```

---

## 🐛 **Troubleshooting**

### Problème: "PostHog: Clés manquantes"

**Vérifier `.env.local`:**
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

### Problème: "User identifié 36 fois"

**Vérifier que `hasIdentified.current` est bien utilisé:**
```typescript
if (hasIdentified.current) {
  console.log('🔄 PostHog: User déjà identifié, skip');
  return;
}
```

### Problème: "Événements ne s'affichent pas"

1. **Vérifier les console.log** dans la console browser
2. **Vérifier le dashboard PostHog** (onglet Events, délai ~30s)
3. **Vérifier que la clé est correcte** dans `.env.local`
4. **Activer le debug** en dev:
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     posthog.debug();
   }
   ```

---

## 🔒 **Sécurité & Best Practices**

### ✅ **Variables d'Environnement**

- Clés dans `.env.local` (PAS dans le code !)
- Prefixe `NEXT_PUBLIC_` pour accès client-side
- `.env.local` dans `.gitignore`

### ✅ **RGPD & Consentement**

Pour la conformité RGPD, ajoutez un banner de consentement :

```typescript
// Optionnel: Bloquer le tracking tant que pas de consentement
if (userConsent === true) {
  posthog.opt_in_capturing();
} else {
  posthog.opt_out_capturing();
}
```

### ✅ **Anonymisation**

PostHog anonymise automatiquement les IPs. Pour aller plus loin :

```typescript
posthog.init(key, {
  api_host: host,
  person_profiles: 'identified_only', // ✅ Déjà activé
  mask_all_text: true, // Masque tout le texte capturé
  mask_all_element_attributes: true,
});
```

---

## 📋 **Checklist de Vérification**

Après le déploiement, vérifiez:

- [ ] PostHog s'initialise **une seule fois** (check console logs)
- [ ] User identifié **une seule fois** au login
- [ ] Événements `game_started` trackés au chargement
- [ ] Événements `message_sent` trackés à chaque message
- [ ] Événements `game_ended` trackés à la victoire/défaite
- [ ] Événements `language_changed` trackés au changement de langue
- [ ] Événements `level_navigation` trackés à la navigation
- [ ] Dashboard PostHog affiche les événements (délai ~30s)
- [ ] Re-renders ne causent pas de ré-initialisation
- [ ] Pas de console.error lié à PostHog

---

## 🎯 **Résumé**

```
✅ PostHog initialisé dans PosthogProvider
✅ Identification automatique avec Clerk
✅ Protection contre les re-renders
✅ 6 événements custom trackés
✅ Console logs pour le debug
✅ Données enrichies (durée, tours, résultat...)
✅ Dashboard PostHog prêt pour analytics
```

---

**🚀 PostHog est maintenant opérationnel ! Lancez le jeu et ouvrez la console pour voir les logs.**