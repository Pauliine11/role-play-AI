# 🪄 Système de Challenges Magiques - Documentation Complète

## 📋 Vue d'ensemble

Le système de challenges magiques ajoute une dimension **action/réflexe** au jeu RPG narratif. Lorsqu'un joueur envoie un message dans le chat, il y a **30% de chances** qu'un événement aléatoire se déclenche, nécessitant un mini-jeu de précision à la souris.

---

## 🎯 Concept

### Déclenchement
- **Probabilité** : 30% par message envoyé
- **Moment** : **AVANT** l'affichage de la réponse du PNJ (Option A)
- **Scénarisation** : 6 types d'événements Harry Potter aléatoires

### Mécanique de jeu
Inspiré de l'image fournie :
- Un **cercle magique** avec des points de contrôle apparaît
- Le joueur doit **suivre le tracé avec sa souris** sans sortir de la zone
- Un **timer** limite le temps disponible (3-5 secondes selon difficulté)
- **Succès** → Bonus + animation de victoire
- **Échec** → Game Over avec options Recommencer/Retour accueil

---

## 🎮 Les 6 Types de Challenges

| Menace | Sort à lancer | Couleur | Difficulté | Durée | Tolérance |
|--------|---------------|---------|------------|-------|-----------|
| 🌑 **Détraqueur** | Expecto Patronum | Argenté (#C0D6E4) | Difficile | 4s | 25px |
| 🕷️ **Araignée géante** | Arania Exumai | Rouge (#E74C3C) | Moyen | 4.5s | 30px |
| 🔥 **Incendie magique** | Aguamenti | Bleu (#3498DB) | Facile | 5s | 35px |
| 🌿 **Filet du Diable** | Lumos Solem | Or (#F39C12) | Moyen | 4.5s | 30px |
| 🐍 **Serpent** | Vipera Evanesca | Vert (#2ECC71) | Facile | 5s | 35px |
| 🧊 **Piège de glace** | Incendio | Orange (#E67E22) | Moyen | 4.5s | 30px |

---

## 🏆 Système de Récompenses

### En cas de SUCCÈS :
1. **+30 XP bonus** (toujours)
2. **20% de chance** de révéler un indice sur le mot secret
3. **Animation de victoire** :
   - Explosion de particules magiques
   - Patronus/effet visuel selon le sort
   - Son de victoire (optionnel)
   - Message de félicitations
4. **Compteur visible** : "⚡ Défis réussis : X"

### En cas d'ÉCHEC :
- **Overlay Game Over** avec :
  - Message thématique selon la menace
  - 🔄 **Bouton "Recommencer le niveau"** (reset complet)
  - 🏠 **Bouton "Retour à l'accueil"** (sauvegarde progression)
- **1 seule tentative** par challenge

---

## 🏗️ Architecture Technique

### Fichiers créés

#### **Types et Configuration**
```
src/features/game/types/challenge.types.ts
```
- `ChallengeType` : Type union des 6 menaces
- `ChallengeDifficulty` : 'easy' | 'medium' | 'hard'
- `Challenge` : Interface complète d'un challenge
- `ChallengeResult` : Résultat avec XP, indice, temps
- `CHALLENGE_CONFIG` : Configuration de tous les challenges
- Constantes : `XP_BONUS`, `HINT_REVEAL_CHANCE`, `CHALLENGE_SPAWN_RATE`

#### **Hook personnalisé**
```
src/features/game/hooks/useSpellChallenge.ts
```
- Gestion de la position de la souris en temps réel
- Calcul de la distance au cercle
- Détection de sortie de zone
- Gestion du timer
- Calcul de la progression (0-100%)
- Détection de complétion (99%)

#### **Composants**
```
src/features/game/components/SpellChallenge.tsx
```
Interface du mini-jeu :
- Overlay full-screen avec backdrop blur
- Personnage avec baguette (émoji 🧙‍♂️)
- Menace animée (👻🕷️🔥🌿🐍🧊)
- Cercle magique SVG avec points de contrôle
- Barre de progression circulaire
- Timer visuel
- Particules magiques qui suivent la souris
- Affichage du pourcentage de progression

```
src/features/game/components/ChallengeSuccess.tsx
```
Écran de victoire :
- Animation d'explosion de particules
- Affichage des récompenses (XP, indice)
- Emoji de succès selon le sort
- Auto-fermeture après 4 secondes

```
src/features/game/components/ChallengeGameOver.tsx
```
Écran de défaite :
- Message thématique selon la menace
- Effet de brume animé
- 2 boutons d'action
- Citation de Dumbledore

#### **Actions serveur**
```
src/features/game/actions/conversation-actions.ts
```
- `shouldTriggerChallenge()` : Détermine si 30% est atteint
- `generateRandomChallenge()` : Tire au sort parmi les 6 types

```
src/features/game/actions/game-actions.ts
```
- Extension du retour de `playTurn()` avec `hasChallenge` et `challengeType`

#### **Types globaux**
```
src/shared/types/index.ts
```
- Extension de `GameState` avec :
  - `hasChallenge?: boolean`
  - `challengeType?: ChallengeType`

---

## 🔄 Flux de Jeu

### 1. Joueur envoie un message
```typescript
handleSendMessage() appelé
```

### 2. Appel serveur
```typescript
const data = await playTurn(messages, language, turnNumber);
// data peut contenir hasChallenge: true
```

### 3. Détection du challenge
```typescript
if (data.hasChallenge && data.challengeType) {
  setPendingGameState(data); // Stocke la réponse du PNJ
  setCurrentChallenge(data.challengeType);
  setShowChallenge(true); // Affiche le mini-jeu
  return; // ⛔ On arrête ici
}
```

### 4. Mini-jeu actif
```typescript
<SpellChallenge
  challenge={CHALLENGE_CONFIG[currentChallenge]}
  onComplete={handleChallengeSuccess}
  onFail={handleChallengeFail}
/>
```

Le joueur doit suivre le cercle avec sa souris :
- ✅ **Succès** → `onComplete()` appelé avec `ChallengeResult`
- ❌ **Échec** → `onFail()` appelé

### 5A. En cas de SUCCÈS
```typescript
handleChallengeSuccess(result)
  ↓
setShowChallenge(false)
setChallengeResult(result)
setShowChallengeSuccess(true) // Affiche l'écran de victoire
setChallengesCompleted(prev => prev + 1)
```

**Écran de victoire affiché pendant 4 secondes**

```typescript
handleContinueAfterSuccess()
  ↓
setGameState(pendingGameState) // Applique la réponse du PNJ stockée
setMessages(prev => [...prev, assistant message]) // Affiche le message
// + Gestion game_won / game_over normale
setPendingGameState(null)
```

### 5B. En cas d'ÉCHEC
```typescript
handleChallengeFail()
  ↓
setShowChallenge(false)
setShowChallengeGameOver(true) // Affiche l'overlay Game Over
```

**L'utilisateur a 2 choix** :
- 🔄 **Recommencer** → `handleRestartAfterChallengeFail()` → Reset complet
- 🏠 **Retour accueil** → `router.push('/')` → Quitte la page

---

## 🎨 Design & UX

### Palette de couleurs
- **Overlay** : `bg-black/90 backdrop-blur-md`
- **Cercle** : Couleur selon le challenge (voir tableau)
- **Lueur** : `drop-shadow` avec la couleur du sort
- **Particules** : Suivent la souris avec animation de dispersion

### Animations (Framer Motion)
- Entrée des éléments avec `initial` + `animate`
- Rotation de la menace
- Pulsation du point de souris
- Particules qui s'éloignent avec `motion.div`
- Explosion lors du succès

### Responsive
- Tailles fixes pour le cercle (600x600px)
- Textes et émojis en `rem`/`em`
- Overlay `fixed inset-0` pour toujours couvrir l'écran

---

## 📊 Compteur de Challenges

Affiché dans le **GameHeader** :
```tsx
{challengesCompleted > 0 && (
  <div className="flex items-center gap-2 px-4 py-2 bg-[#6B4F2F]/50 border-2 border-[#C9A227] rounded-lg">
    <span className="text-2xl">⚡</span>
    <div className="text-sm">
      <p className="text-[#C9A227] font-bold">{challengesCompleted}</p>
      <p className="text-[#B8A77E] text-xs">
        {challengesCompleted === 1 ? 'Défi' : 'Défis'}
      </p>
    </div>
  </div>
)}
```

Position : À droite du titre du niveau

---

## 🐛 Gestion d'erreurs

### Cas gérés :
1. **Challenge déclenché mais pas de type** → Ignoré
2. **pendingGameState null après succès** → Log console + continue
3. **Souris sort de la zone** → Fail immédiat
4. **Timer atteint 0** → Fail immédiat
5. **Double clic pendant challenge** → Ignoré (isActive check)

### Debug
Ouvrir la console pour voir :
- `✨ Challenge triggered: [type]` (si activé)
- Position de la souris en temps réel
- Distance au cercle
- Progression (%)

---

## 🚀 Améliorations Futures

### Court terme
- [ ] Sons pour chaque sort (`.wav` ou `.mp3`)
- [ ] Vibration mobile (navigator.vibrate)
- [ ] Tutoriel au premier challenge
- [ ] Badge pour 10 challenges réussis

### Moyen terme
- [ ] Difficulté adaptative (plus de challenges si le joueur réussit)
- [ ] Combo système (multiplicateur XP)
- [ ] Classement des meilleurs temps
- [ ] Variantes de tracés (spirale, zigzag, triangle)

### Long terme
- [ ] Mode entraînement sans conséquence
- [ ] Challenges spéciaux pour boss fights
- [ ] Achievements par type de challenge
- [ ] Replay du tracé après échec

---

## 📝 Configuration

### Modifier la probabilité
```typescript
// src/features/game/types/challenge.types.ts
export const CHALLENGE_SPAWN_RATE = 0.3; // 30% → Modifier ici
```

### Ajuster la difficulté
```typescript
// src/features/game/types/challenge.types.ts
CHALLENGE_CONFIG.dementor.tolerance = 35; // Plus facile (défaut: 25)
CHALLENGE_CONFIG.dementor.duration = 5000; // Plus de temps (défaut: 4000)
```

### Changer les récompenses
```typescript
// src/features/game/types/challenge.types.ts
export const XP_BONUS = 50; // Au lieu de 30
export const HINT_REVEAL_CHANCE = 0.5; // 50% au lieu de 20%
```

---

## ✅ Checklist de Test

- [ ] Challenge se déclenche aléatoirement (~30%)
- [ ] Cercle magique s'affiche correctement
- [ ] Souris trackée en temps réel
- [ ] Sortie de zone = échec immédiat
- [ ] Timer fonctionne et provoque échec à 0
- [ ] Succès affiche écran de victoire avec XP
- [ ] Indice révélé parfois (20%)
- [ ] Échec affiche Game Over avec 2 boutons
- [ ] Recommencer reset tout le niveau
- [ ] Retour accueil fonctionne
- [ ] Compteur ⚡ s'incrémente après succès
- [ ] Animation fluide sur desktop
- [ ] Pas de lag pendant le challenge
- [ ] Message du PNJ s'affiche après succès
- [ ] Game won/over normal après challenge

---

## 🎓 Conclusion

Le système de challenges magiques ajoute une **dimension skill-based** au jeu RPG narratif, récompensant la précision et les réflexes du joueur tout en restant fidèle à l'univers Harry Potter. Les 6 types de menaces offrent de la variété, et le système de récompenses encourage la performance sans pénaliser trop durement l'échec.

**Profitez de vos duels magiques ! ⚡🪄**
