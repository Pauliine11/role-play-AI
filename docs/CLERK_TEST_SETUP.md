# 🔐 Configuration du compte de test Clerk

## ❌ Problème actuel

Les tests E2E échouent car le compte `test@test.com` n'existe pas dans Clerk ou les credentials sont incorrects.

## ✅ Solution : Créer le compte de test

### Étape 1 : Créer l'utilisateur dans Clerk

1. **Ouvrir Clerk Dashboard**  
   https://dashboard.clerk.com

2. **Sélectionner votre projet**  
   (celui avec le nom qui correspond à votre app)

3. **Aller dans Users**  
   Menu de gauche > **Users**

4. **Create User**  
   Bouton en haut à droite

5. **Remplir le formulaire**  
   - Email address: `test@test.com`
   - Password: `123Soleil!1535*`  
     (ou changez le mot de passe dans `.env.local`)
   - ✅ Cochez "Skip email verification"

6. **Create**

### Étape 2 : Désactiver la vérification email (CRITIQUE)

1. **Settings** (dans le menu de gauche)

2. **Email, Phone, Username**

3. **Email address** > Cliquez sur l'icône ⚙️ (Settings)

4. **Décochez** :
   - ☐ "Verify at sign-up"
   - ☐ "Verify at sign-in" (si disponible)

5. **Save**

### Étape 3 : Relancer les tests

```bash
pnpm test
```

## 🔄 Alternative : Utiliser un compte existant

Si vous avez déjà un compte dans Clerk, modifiez `.env.local` :

```bash
E2E_CLERK_USER_USERNAME=votre-email@existant.com
E2E_CLERK_USER_PASSWORD=VotreMotDePasseActuel
```

Puis relancez les tests.

## 📊 Vérifier que ça fonctionne

Après avoir créé le compte, les tests devraient afficher :

```
✓ clerk.signIn() terminé, attente de la redirection...
✓ Redirigé vers: http://localhost:3000/
✓ navbar-user-menu visible
✓ Session sauvegardée
```

## 🐛 Toujours des problèmes ?

Testez manuellement :
1. Ouvrez http://localhost:3000
2. Cliquez sur "Sign in"
3. Connectez-vous avec `test@test.com` / `123Soleil!1535*`
4. Si ça ne marche pas manuellement → Le problème n'est pas Playwright

## 📝 Notes

- Le compte de test est uniquement pour l'environnement de développement
- Ne jamais utiliser de vrais comptes utilisateurs pour les tests E2E
- Le mot de passe est stocké dans `.env.local` (qui est gitignored)
