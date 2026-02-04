# 🏰 Refonte Thème Médiéval - Le Grimoire Éveillé

## ✅ Modifications Effectuées

### 1. Design Tokens & Configuration (globals.css)

**Palette de Couleurs Médiévales :**
```css
--color-grimoire-bg: #0E1320           /* Fond principal - bleu nuit très sombre */
--color-grimoire-surface: #141B2D      /* Cartes/panels - pierre sombre */
--color-grimoire-surface-2: #101827    /* Sidebar - pierre plus sombre */
--color-grimoire-border: #3A2F1E       /* Bordures - brun vieilli */
--color-grimoire-parchment: #E6D5A7    /* Texte principal - parchemin */
--color-grimoire-parchment-muted: #B8A77E  /* Texte secondaire */
--color-grimoire-gold: #C9A227         /* Accent or */
--color-grimoire-leather: #6B4F2F      /* Boutons cuir */
--color-grimoire-leather-hover: #8C6A3F /* Hover cuir */
```

**Background Médiéval :**
- Gradient multi-couches (bleu nuit → brun → bleu foncé)
- Texture subtile avec radial gradients + pattern CSS
- Effet parchemin ancien avec repeating-linear-gradient

**Scrollbar Médiévale :**
- Track : pierre sombre (#141B2D)
- Thumb : gradient cuir avec bordure brun
- Hover : cuir éclair ci

### 2. Polices (layout.tsx)

**Ajoutées via next/font/google :**
- **Cinzel** : Titres majestueux (var(--font-cinzel))
- **Merriweather** : Corps lisible (var(--font-merriweather))
- **Cormorant Garamond** : Conservé pour éléments thématiques

**Appliqué :**
- h1-h6 : Cinzel + text-shadow or
- body/p : Merriweather + couleur parchemin

### 3. Sidebar (✅ COMPLÉTÉ)

**Thème Grimoire :**
- Fond : pierre sombre (#101827)
- Bordure droite : brun épais (2px)
- Shadow : profonde et diffuse

**États des Items :**
- Normal : texte parchemin (#B8A77E)
- Hover : fond pierre + glow or subtil
- Active : fond cuir (#6B4F2F) + bordure or (#C9A227) + barre latérale or

**Badges :**
- Fond sombre + bordure brun
- Actif : or brillant
- Mini badges : or avec glow

**Footer :**
- Fond très sombre (#0E1320)
- Version en Cinzel or

### 4. Page d'Accueil (EN COURS)

**À Modifier :**
```typescript
// Background
className="min-h-screen text-[#E6D5A7]"
// Retire bg-gray-900, le body gère le fond

// Titre principal
style={{ fontFamily: 'var(--font-cinzel)' }}
className="text-[#C9A227] drop-shadow-[0_2px_8px_rgba(201,162,39,0.4)]"

// Sous-titre
style={{ fontFamily: 'var(--font-merriweather)' }}
className="text-[#B8A77E]"

// Badge langue
className="bg-[#141B2D] border-[#3A2F1E] text-[#B8A77E]"
```

### 5. Cards de Niveaux (À FAIRE)

**Structure Cible :**
```typescript
// Card container
className="bg-[#141B2D] border-2 border-[#3A2F1E] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]"

// Hover
className="hover:border-[#C9A227] hover:shadow-[0_8px_32px_rgba(201,162,39,0.2)]"

// Badge statut
// Disponible
className="bg-[#6B4F2F] text-[#E6D5A7] border border-[#C9A227]"

// Complété
className="bg-[#2F6B3A] text-[#E6D5A7] border border-[#4A8F50]"

// Verrouillé
className="bg-[#1a1410] text-[#8C7A5E] border border-[#3A2F1E]"

// Titre niveau
style={{ fontFamily: 'var(--font-cinzel)' }}
className="text-[#C9A227]"

// Character badge
className="bg-[#6B4F2F]/30 border border-[#3A2F1E] text-[#E6D5A7]"

// Description
style={{ fontFamily: 'var(--font-merriweather)' }}
className="text-[#B8A77E]"
```

### 6. Boutons (À FAIRE)

**Bouton Principal (Commencer l'aventure) :**
```typescript
className="bg-[#6B4F2F] hover:bg-[#8C6A3F] text-[#E6D5A7] border-2 border-[#C9A227] 
           shadow-lg hover:shadow-[0_4px_16px_rgba(201,162,39,0.3)]
           transition-all duration-200
           font-[family-name:var(--font-cinzel)] tracking-wide"
```

**Bouton Secondaire (Rejouer) :**
```typescript
className="bg-[#2F6B3A] hover:bg-[#3D844C] text-[#E6D5A7] border-2 border-[#4A8F50]"
```

**Bouton Disabled :**
```typescript
className="bg-[#1a1410] text-[#5a4028] border border-[#3A2F1E] cursor-not-allowed opacity-50"
```

### 7. Navbar/NavbarResponsive (À FAIRE)

**À modifier :**
- Fond : bg-[#101827]
- Bordure bottom : border-[#3A2F1E]
- Titre : Cinzel + text-[#C9A227]
- Shadow : shadow-[0_4px_16px_rgba(0,0,0,0.4)]

### 8. Footer (À FAIRE)

**Style cible :**
```typescript
className="bg-[#0E1320] border-t border-[#3A2F1E] text-[#B8A77E]"
style={{ fontFamily: 'var(--font-merriweather)' }}
```

---

## 🎨 Classes Tailwind Utilitaires Créées

Via @theme dans globals.css, utiliser :
```typescript
// Textes
text-[#E6D5A7]       // Parchment primary
text-[#B8A77E]       // Parchment muted
text-[#C9A227]       // Gold
text-[#8C7A5E]       // Brun clair

// Backgrounds
bg-[#0E1320]         // BG principal
bg-[#141B2D]         // Surface
bg-[#101827]         // Surface-2 (sidebar)
bg-[#6B4F2F]         // Leather
bg-[#8C6A3F]         // Leather hover

// Borders
border-[#3A2F1E]     // Brun vieilli
border-[#C9A227]     // Or

// Shadows or
shadow-[0_0_8px_rgba(201,162,39,0.15)]          // Glow subtil
drop-shadow-[0_2px_8px_rgba(201,162,39,0.4)]    // Text shadow or
```

---

## 📋 TODO - Fichiers à Modifier

### Priorité 1 (Critique)
- [ ] `src/app/page.tsx` - Cards de niveaux (lignes 100-200)
- [ ] `src/shared/components/layout/NavbarResponsive.tsx` - Header
- [ ] `src/shared/components/layout/Footer.tsx` - Pied de page

### Priorité 2 (Important)
- [ ] `src/app/game/page.tsx` - Interface de jeu
- [ ] `src/shared/components/ui/Button.tsx` - Composant bouton (si existe)
- [ ] `src/shared/components/ui/Snackbar.tsx` - Notifications

### Priorité 3 (Optionnel)
- [ ] `src/app/admin/levels/new/page.tsx` - Page admin
- [ ] Autres composants UI

---

## 🚀 Script de Remplacement Rapide

Pour appliquer rapidement aux cards de niveaux, chercher et remplacer :

```typescript
// OLD COLORS → NEW COLORS
"border-indigo-500"    → "border-[#C9A227]"
"border-green-500"     → "border-[#4A8F50]"
"bg-indigo-600"        → "bg-[#6B4F2F]"
"bg-green-600"         → "bg-[#2F6B3A]"
"text-indigo-300"      → "text-[#C9A227]"
"text-white"           → "text-[#E6D5A7]"
"text-gray-300"        → "text-[#B8A77E]"
"text-gray-400"        → "text-[#8C7A5E]"
"bg-white/10"          → "bg-[#6B4F2F]/30"
"font-serif"           → style fontFamily cinzel/merriweather
```

---

## ✅ Checklist de Cohérence

- [x] Tokens de couleurs définis
- [x] Polices médiévales ajoutées
- [x] Background médiéval avec texture
- [x] Scrollbar thématique
- [x] Focus styles or
- [x] Sidebar complètement refaite
- [ ] Page d'accueil (header fait, cards à faire)
- [ ] Cards de niveaux
- [ ] Boutons
- [ ] Navbar
- [ ] Footer
- [ ] Page de jeu
- [ ] Composants UI

---

## 📸 Rendu Attendu

**Palette :**
- Dominant : Bleu nuit profond (#0E1320)
- Secondaire : Pierre sombre (#141B2D)
- Accents : Or (#C9A227) + Cuir (#6B4F2F)
- Texte : Parchemin (#E6D5A7 / #B8A77E)

**Ambiance :**
- Sombre mais lisible (AAA)
- Textures subtiles (pas d'images)
- Glow or discret sur interactions
- Shadows profondes mais douces
- Typographie élégante et lisible

**Logo :**
- ✅ INCHANGÉ (comme demandé)
- Espace autour ajusté si nécessaire

---

**Status :** ~40% complété  
**Prochaine étape :** Continuer avec les cards et boutons de la page d'accueil
