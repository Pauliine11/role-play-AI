# 🎯 Navigation Post-Victoire

## ✅ **Nouveau Système de Navigation**

Après avoir réussi un niveau, vous avez maintenant **plusieurs options** pour continuer !

---

## 🎮 **Écran de Victoire**

### Boutons Disponibles

#### ✅ **Si Victoire + Il y a un Niveau Suivant**

```
┌─────────────────────────────────────────┐
│          🎉 Victoire !                  │
│                                         │
│  "Vous avez accompli votre mission !" │
│                                         │
│  [ 🔄 Recommencer ]  [ Niveau Suivant → ]  │
└─────────────────────────────────────────┘
```

**Boutons:**
1. **🔄 Recommencer** → Rejouer le niveau actuel
2. **Niveau Suivant →** → Passer au niveau suivant directement

---

#### ✅ **Si Victoire + Dernier Niveau**

```
┌─────────────────────────────────────────┐
│          🎉 Victoire !                  │
│                                         │
│  "Vous avez accompli votre mission !" │
│                                         │
│  [ 🔄 Recommencer ]  [ 🏠 Retour à l'accueil ]  │
└─────────────────────────────────────────┘
```

**Boutons:**
1. **🔄 Recommencer** → Rejouer le niveau
2. **🏠 Retour à l'accueil** → Voir tous les niveaux

---

#### ❌ **Si Game Over**

```
┌─────────────────────────────────────────┐
│          ❌ Game Over                   │
│                                         │
│   "La mission a échoué. Réessayez !"  │
│                                         │
│  [ 🔄 Recommencer ]  [ 🏠 Retour à l'accueil ]  │
└─────────────────────────────────────────┘
```

**Boutons:**
1. **🔄 Recommencer** → Réessayer le niveau
2. **🏠 Retour à l'accueil** → Choisir un autre niveau

---

## 🔄 **Logique de Navigation**

### Détection du Niveau Suivant

```typescript
// Trouve le niveau actuel dans la liste
const currentIndex = levels.findIndex(l => l.id === currentLevel?.id);

// Trouve le niveau suivant (s'il existe)
const nextLevel = currentIndex >= 0 && currentIndex < levels.length - 1 
  ? levels[currentIndex + 1] 
  : null;

// Vérifie si c'est le dernier niveau
const isLastLevel = !nextLevel || nextLevel.status === 'locked';
```

### Conditions d'Affichage

| Condition | Bouton Affiché |
|-----------|----------------|
| **Victoire + Niveau suivant disponible** | "Niveau Suivant →" |
| **Victoire + Dernier niveau** | "🏠 Retour à l'accueil" |
| **Game Over** | "🏠 Retour à l'accueil" |

---

## 📋 **Scénarios d'Utilisation**

### Scénario 1: Progression Normale

```bash
1. Jouer Hermione (niveau 1) → ✅ Victoire
   → Cliquer "Niveau Suivant →"
   
2. Jouer Hagrid (niveau 2) → ✅ Victoire
   → Cliquer "Niveau Suivant →"
   
3. Jouer Dumbledore (niveau 3) → ✅ Victoire
   → (Dernier niveau) → Cliquer "🏠 Retour à l'accueil"
   
4. Page d'accueil → Tous les niveaux complétés ✓
```

### Scénario 2: Rejouer un Niveau

```bash
1. Jouer Hermione → ✅ Victoire
2. Cliquer "🔄 Recommencer"
3. Le niveau se recharge
4. Rejouer pour améliorer son score
```

### Scénario 3: Game Over

```bash
1. Jouer Hermione → ❌ Game Over (dire "moldu")
2. Options:
   - "🔄 Recommencer" → Réessayer Hermione
   - "🏠 Retour à l'accueil" → Choisir un autre niveau
```

---

## 🎨 **Design des Boutons**

### Bouton "Niveau Suivant"

```css
Couleur: Vert (bg-green-600)
Hover: Vert clair (bg-green-500)
Icône: →
Effet: Scale actif (active:scale-95)
```

### Bouton "Recommencer"

```css
Couleur: Gris (bg-gray-700)
Hover: Gris clair (bg-gray-600)
Icône: 🔄
Effet: Scale actif
```

### Bouton "Retour à l'accueil"

```css
Couleur: Indigo (bg-indigo-600)
Hover: Indigo clair (bg-indigo-500)
Icône: 🏠
Effet: Scale actif
```

---

## 🧪 **Tests**

### Test 1: Victoire avec Niveau Suivant

```bash
1. Créer 2 niveaux: Hermione (ordre 1) et Hagrid (ordre 2)
2. Jouer Hermione
3. Gagner (dire "youpi")
4. ✅ Vérifier: Bouton "Niveau Suivant →" visible
5. Cliquer dessus
6. ✅ Vérifier: Niveau Hagrid se charge
```

### Test 2: Victoire sur Dernier Niveau

```bash
1. Créer 1 seul niveau (Hermione)
2. Jouer et gagner
3. ✅ Vérifier: Bouton "🏠 Retour à l'accueil" visible
4. Cliquer dessus
5. ✅ Vérifier: Page d'accueil s'affiche
```

### Test 3: Game Over

```bash
1. Jouer Hermione
2. Dire "moldu" → Game Over
3. ✅ Vérifier: Boutons "🔄 Recommencer" + "🏠 Retour"
4. Cliquer "🏠 Retour"
5. ✅ Vérifier: Page d'accueil s'affiche
```

---

## 🌐 **Support Bilingue**

Les boutons s'adaptent automatiquement à la langue:

| Bouton | Français | Anglais |
|--------|----------|---------|
| Niveau suivant | "Niveau Suivant" | "Next Level" |
| Recommencer | "Recommencer" | "Restart" |
| Retour | "Retour à l'accueil" | "Back to Home" |

---

## 📊 **Flow Utilisateur**

```
Page d'Accueil
    ↓
Sélectionner Niveau 1 (Hermione)
    ↓
Jouer
    ↓
Victoire ✅
    ↓
┌───────────────────────────┐
│ [ Recommencer ] [ Suivant → ] │
└───────────────────────────┘
    ↓ (Clic "Suivant")
Niveau 2 (Hagrid)
    ↓
Jouer
    ↓
Victoire ✅
    ↓
┌───────────────────────────┐
│ [ Recommencer ] [ Suivant → ] │
└───────────────────────────┘
    ↓ (Clic "Suivant")
Niveau 3 (Dumbledore)
    ↓
Jouer
    ↓
Victoire ✅ (Dernier niveau)
    ↓
┌───────────────────────────┐
│ [ Recommencer ] [ 🏠 Accueil ] │
└───────────────────────────┘
    ↓ (Clic "🏠 Accueil")
Page d'Accueil (Tous ✓ Complétés)
```

---

## 🔧 **Personnalisation**

### Changer le Style du Bouton "Niveau Suivant"

Dans `src/app/immersive/immersive-rpg/page.tsx` (ligne ~310):

```typescript
// Style actuel:
className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white..."

// Exemple - Style doré:
className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-white..."
```

### Ajouter un Message Personnalisé

```typescript
{!isLastLevel && nextLevel ? (
  <div className="mb-4 text-center">
    <p className="text-gray-400 text-sm mb-2">
      {language === 'fr' 
        ? `Prochain défi: ${nextLevel.title}` 
        : `Next challenge: ${nextLevel.title}`}
    </p>
    <button onClick={...}>
      Niveau Suivant →
    </button>
  </div>
) : ...}
```

---

## ✅ **Résumé des Améliorations**

Avant:
```
Victoire → [ Recommencer ]
```

Après:
```
Victoire (niveau 1) → [ Recommencer ] [ Niveau Suivant → ]
Victoire (dernier)  → [ Recommencer ] [ 🏠 Accueil ]
Game Over           → [ Recommencer ] [ 🏠 Accueil ]
```

**Avantages:**
- ✅ Navigation fluide entre les niveaux
- ✅ Pas besoin de retourner à l'accueil
- ✅ Expérience utilisateur améliorée
- ✅ Encourage la progression continue
- ✅ Détection automatique du dernier niveau

---

**🎮 Testez maintenant : Gagnez un niveau et cliquez sur "Niveau Suivant" !**
