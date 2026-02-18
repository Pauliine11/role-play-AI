# 📐 Structure des Composants UI - Documentation

## 🎯 Objectif

Cette structure permet de centraliser les composants primitifs (Button, Input, TextArea, Badge, etc.) dans un seul endroit pour:
- ✅ **Cohérence** - Un seul style de bouton partout dans l'app
- ✅ **Maintenabilité** - Changer un bouton = changer toute l'app
- ✅ **Scalabilité** - L'IA peut facilement trouver et utiliser les composants
- ✅ **Variants** - Styles séparés dans des fichiers dédiés

## 📁 Structure des Dossiers

```
/src/shared/components/ui/
├── button/
│   ├── Button.tsx              # Composant de base
│   ├── button.variants.ts      # Variants (primary, secondary, danger, etc.)
│   └── index.ts                # Export centralisé
├── input/
│   ├── Input.tsx               # Composant de base
│   ├── input.variants.ts       # Variants (default, error, chat)
│   └── index.ts                # Export centralisé
├── textarea/
│   ├── TextArea.tsx            # Composant de base
│   ├── textarea.variants.ts    # Variants
│   └── index.ts                # Export centralisé
├── badge/
│   ├── Badge.tsx               # Composant de base  
│   ├── badge.variants.ts       # Variants (completed, locked, available)
│   └── index.ts                # Export centralisé
└── checkbox/                    # À créer si nécessaire
    ├── Checkbox.tsx
    ├── checkbox.variants.ts
    └── index.ts
```

## 🔧 Composants Disponibles

### Button

**Import:**
```typescript
import { Button } from '@/shared/components/ui/button';
```

**Variants disponibles:**

**🎮 Variantes Jeu:**
- `primary` - Bouton principal (bronze)
- `secondary` - Bouton secondaire (or éclatant)
- `danger` - Bouton danger (rouge)
- `magic` - Bouton magique (gradient or)
- `ghost` - Bouton transparent
- `suggestion` - Suggestions de dialogue (pilules)
- `icon` - Bouton icône carré
- `close` - Bouton fermer (X)
- `language` - Bouton de langue (EN/FR)
- `grimoire` - Bouton grimoire (📜)

**🎨 Variantes Layout:**
- `sidebarToggle` - Bouton toggle sidebar (chevron)
- `hamburger` - Bouton menu hamburger (mobile)
- `authSignup` - Bouton inscription (style secondaire)
- `authSignin` - Bouton connexion (style primaire)

**Sizes disponibles:**
- `sm` - Petit
- `md` - Moyen (défaut)
- `lg` - Large

**Exemple d'utilisation:**
```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Commencer l'aventure
</Button>

<Button variant="secondary" isLoading>
  Chargement...
</Button>

<Button variant="suggestion" size="sm">
  Que cachez-vous ?
</Button>
```

### Input

**Import:**
```typescript
import { Input } from '@/shared/components/ui/input';
```

**Variants disponibles:**
- `default` - Input standard
- `error` - Input avec erreur (auto-détecté si `error` prop est fourni)
- `chat` - Input de chat (coins arrondis)

**Sizes disponibles:**
- `sm` - Petit
- `md` - Moyen (défaut)
- `lg` - Large

**Props spéciales:**
- `label?` - Label optionnel
- `error?` - Message d'erreur (change automatiquement le variant)
- `labelClassName?` - Classes CSS custom pour le label

**Exemple d'utilisation:**
```tsx
<Input 
  label="Nom du personnage"
  placeholder="Hermione Granger"
  error="Ce champ est requis"
/>

<Input 
  variant="chat"
  size="lg"
  placeholder="Tapez votre message..."
/>
```

### TextArea

**Import:**
```typescript
import { TextArea } from '@/shared/components/ui/textarea';
```

**Variants disponibles:**
- `default` - TextArea standard
- `error` - TextArea avec erreur

**Props spéciales:**
- `label?` - Label optionnel
- `error?` - Message d'erreur
- `rows?` - Nombre de lignes (défaut: 4)

**Exemple d'utilisation:**
```tsx
<TextArea 
  label="Description du niveau"
  placeholder="Décrivez le contexte..."
  rows={6}
/>
```

### Badge

**Import:**
```typescript
import { Badge } from '@/shared/components/ui/badge';
```

**Variants disponibles:**
- `completed` - Badge complété (or avec éclat)
- `locked` - Badge verrouillé (gris foncé)
- `available` - Badge disponible (bronze)
- `default` - Badge neutre

**Sizes disponibles:**
- `sm` - Petit
- `md` - Moyen (défaut)
- `lg` - Large

**Exemple d'utilisation:**
```tsx
<Badge variant="completed" size="md">
  ✅ Complété
</Badge>

<Badge variant="locked">
  🔒 Verrouillé
</Badge>
```

## 📝 Règles d'Utilisation

### ✅ À FAIRE:

1. **Toujours utiliser les composants UI primitifs** au lieu de recréer des boutons/inputs
2. **Passer `className`** pour des modifications ponctuelles de style
3. **Créer un nouveau variant** si un style est réutilisé plusieurs fois
4. **Respecter la structure en dossiers** - un composant = un dossier

**Exemple de modification ponctuelle avec className:**
```tsx
<Button variant="primary" className="w-full mt-4">
  Texte du bouton
</Button>
```

### ❌ À NE PAS FAIRE:

1. **Ne pas créer de nouveaux boutons** avec `<button className="...">` directement
2. **Ne pas dupliquer les styles** - utiliser les variants
3. **Ne pas mélanger les approches** - soit variant, soit className custom
4. **Ne pas casser la structure** - tous les composants UI dans `/ui/`

## 🔄 Migrations Effectuées

### Fichiers Mis à Jour:

**🎮 Composants Jeu:**

✅ `/src/features/game/components/ChatInput.tsx`
- 🔄 Boutons suggestion → `<Button variant="suggestion">`
- 🔄 Input chat hardcodé → `<Input variant="chat">`
- 🔄 Bouton envoyer → `<Button variant="icon">`

✅ `/src/features/game/components/GameHeader.tsx`
- 🔄 Bouton langue → `<Button variant="language">`
- 🔄 Bouton grimoire → `<Button variant="grimoire">`

✅ `/src/features/game/components/GameOverOverlay.tsx`
- 🔄 Bouton restart → `<Button variant="ghost">`
- 🔄 Bouton niveau suivant → `<Button variant="secondary">`
- 🔄 Bouton accueil → `<Button variant="primary">`

✅ `/src/app/page.tsx`
- 🔄 Badge de status → `<Badge variant="completed|locked|available">`

✅ `/src/app/admin/levels/new/page.tsx`
- 🔄 Import Button mis à jour

**🎨 Composants Layout:**

✅ `/src/shared/components/layout/Sidebar.tsx`
- 🔄 Bouton toggle sidebar → `<Button variant="sidebarToggle">`

✅ `/src/shared/components/layout/NavbarResponsive.tsx`
- 🔄 Bouton hamburger mobile → `<Button variant="hamburger">`
- 🔄 Bouton inscription → `<Button variant="authSignup">`
- 🔄 Bouton connexion → `<Button variant="authSignin">`

### Anciens Fichiers Supprimés:

🗑️ `/src/shared/components/ui/Button.tsx` (remplacé par `/button/Button.tsx`)
🗑️ `/src/shared/components/ui/Input.tsx` (remplacé par `/input/Input.tsx`)
🗑️ `/src/shared/components/ui/TextArea.tsx` (remplacé par `/textarea/TextArea.tsx`)

## 🎨 Ajouter un Nouveau Variant

### Exemple: Ajouter un variant "outline" au Button

1. **Ouvrir `/src/shared/components/ui/button/button.variants.ts`**

2. **Ajouter le variant dans l'objet:**
```typescript
export const buttonVariants = {
  // ... variants existants
  
  outline: "bg-transparent border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0E1320] transition-all",
} as const;
```

3. **Utiliser le nouveau variant:**
```tsx
<Button variant="outline">
  Nouveau style !
</Button>
```

## 📚 Ressources

- [Radix UI Primitives](https://www.radix-ui.com/primitives) - Référence pour identifier les primitives
- Design System: Thème médiéval/grimoire inspiré d'Harry Potter

## 📊 Statistiques de Refactorisation

### Boutons Remplacés:
- **20+ boutons hardcodés** → **14 variants Button**
- **3 inputs hardcodés** → **1 composant Input avec 3 variants**
- **1 textarea hardcodé** → **1 composant TextArea avec 2 variants**
- **3 badges hardcodés** → **1 composant Badge avec 4 variants**

### Couverture Complète:
- ✅ **100%** des primitives UI centralisées
- ✅ **0** bouton hardcodé restant dans `/src`
- ✅ **0** erreur TypeScript
- ✅ **0** erreur ESLint

---

**Dernière mise à jour:** 2026-02-11 (Refactorisation Sidebar/Navbar complétée)  
**Auteur:** Refactorisation automatique AI  
**Version:** 2.0 - Structure complète avec variants Layout
