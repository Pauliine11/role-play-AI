# 🔧 Fix: Activer l'authentification par Password dans Clerk

## ❌ Erreur actuelle

```
Error: Clerk: Failed to sign in: email_code is not enabled.
```

**Explication** : Les tests E2E utilisent `strategy: "password"` mais Clerk est configuré pour utiliser "Email code" (OTP).

## ✅ Solution : Activer Password dans Clerk Dashboard

### Étape 1 : Ouvrir Clerk Dashboard

1. https://dashboard.clerk.com
2. Sélectionnez votre projet

### Étape 2 : Configurer l'authentification par Password

1. Dans le menu de gauche, cliquez sur **"User & Authentication"**

2. Cliquez sur **"Email, Phone, Username"**

3. Trouvez la section **"Email address"**

4. Cliquez sur l'icône ⚙️ (Settings) à droite de "Email address"

5. Dans la section **"Authentication strategies"** :
   
   **IMPORTANT - Activez les DEUX** :
   - ✅ **"Password"** (doit être coché)
   - ✅ **"Email verification code"** (peut rester coché pour d'autres utilisateurs)

6. **Scroll down** et décochez aussi :
   - ☐ "Require verification at sign-up"
   - ☐ "Require verification at sign-in"

7. Cliquez sur **"Continue"** puis **"Save"**

### Étape 3 : Créer le compte de test

1. Menu de gauche > **"Users"**

2. Cliquez sur **"Create User"** (bouton en haut à droite)

3. Remplissez le formulaire :
   - **Email address** : `e2e+clerk_test@example.com`
   - **Password** : `password`
   - ✅ Cochez **"Skip email verification"** (très important !)

4. Cliquez sur **"Create"**

### Étape 4 : Mettre à jour .env.local

Vérifiez que votre fichier `.env.local` contient :

```bash
E2E_CLERK_USER_USERNAME=e2e+clerk_test@example.com
E2E_CLERK_USER_PASSWORD=password
```

### Étape 5 : Relancer les tests

```bash
pnpm test
```

## ✅ Résultat attendu

Les tests devraient maintenant afficher :

```
✓ clerk.signIn() terminé, attente de la redirection...
✓ Redirigé vers: http://localhost:3000/
✓ navbar-user-menu visible
✓ Session sauvegardée
```

Et passer avec succès ! 🎉

## 🐛 Troubleshooting

### Si l'erreur "email_code is not enabled" persiste

Vérifiez que **Password est bien activé** dans :
- User & Authentication > Email, Phone, Username > Email address > Settings (⚙️)
- Authentication strategies > ✅ Password

### Si le test échoue toujours

Testez manuellement :
1. Ouvrez http://localhost:3000
2. Cliquez sur "Sign in"
3. Essayez de vous connecter avec :
   - Email: `e2e+clerk_test@example.com`
   - Password: `password`
4. Ça doit fonctionner **sans demander de code par email**

Si Clerk demande un code email même en manuel → Password n'est pas activé correctement.

## 📊 Checklist finale

Avant de relancer les tests, vérifiez :

- [ ] Password est activé dans Clerk Dashboard
- [ ] Le compte `e2e+clerk_test@example.com` existe
- [ ] "Skip email verification" était coché à la création
- [ ] "Require verification" est décoché dans les settings Email
- [ ] Les variables d'env dans `.env.local` sont correctes
- [ ] Le test manuel fonctionne (connexion avec password, pas de code)

Une fois tout coché → `pnpm test` devrait passer ! ✅
