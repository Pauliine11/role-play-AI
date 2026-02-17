import { clerkSetup } from "@clerk/testing/playwright";
import { test as setup, expect } from "@playwright/test";
import path from "path";

// Run setup tests sequentially
setup.describe.configure({ mode: "serial" });

// Allow more time for authentication flow
setup.setTimeout(90_000);

setup("global setup", async () => {
  await clerkSetup();

  const identifier =
    process.env.E2E_CLERK_USER_USERNAME ?? process.env.E2E_CLERK_USER_EMAIL;

  if (!identifier) {
    throw new Error(
      "Please provide either E2E_CLERK_USER_USERNAME or E2E_CLERK_USER_EMAIL environment variable."
    );
  }

  // Password requis : email_code n'est souvent pas activé dans Clerk
  if (!process.env.E2E_CLERK_USER_PASSWORD) {
    throw new Error(
      "Please provide E2E_CLERK_USER_PASSWORD for E2E sign-in."
    );
  }
});

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");

setup("authenticate", async ({ page }) => {
  console.log("[DEBUG] === DÉBUT authenticate ===");
  console.log("[DEBUG] identifier:", process.env.E2E_CLERK_USER_USERNAME ?? process.env.E2E_CLERK_USER_EMAIL);
  console.log("[DEBUG] password défini:", !!process.env.E2E_CLERK_USER_PASSWORD);

  await page.goto("/");
  console.log("[DEBUG] URL après goto(/):", page.url());

  const identifier =
    process.env.E2E_CLERK_USER_USERNAME ?? process.env.E2E_CLERK_USER_EMAIL!;

  // clerk.signIn() échoue avec email_code et ne redirige pas avec password.
  // On utilise l'approche UI : remplir le formulaire Clerk comme en manuel.
  const password = process.env.E2E_CLERK_USER_PASSWORD!;

  console.log("[DEBUG] Connexion via formulaire UI (email + password)...");

  // Email
  const emailInput = page.locator('input[name="identifier"]').first();
  await expect(emailInput).toBeVisible({ timeout: 15_000 });
  await emailInput.fill(identifier);
  console.log("[DEBUG] Email rempli");

  const continueBtn = page.getByRole("button", { name: "Continue", exact: true }).first();
  await continueBtn.click();
  console.log("[DEBUG] Continue (email) cliqué");

  // Password (peut apparaître après un court délai)
  const passwordInput = page.locator('input[name="password"]').first();
  await expect(passwordInput).toBeVisible({ timeout: 15_000 });
  await passwordInput.fill(password);
  console.log("[DEBUG] Password rempli");

  await page.getByRole("button", { name: "Continue", exact: true }).first().click();
  console.log("[DEBUG] Continue (password) cliqué");

  // Attendre la page suivante (localhost ou factor-two si 2FA activée)
  await page.waitForURL(
    (url) => url.hostname === "localhost" || url.pathname.includes("factor-two"),
    { timeout: 15_000 }
  );
  console.log("[DEBUG] URL après submit:", page.url());

  // Si Clerk demande une 2FA
  if (page.url().includes("factor-two")) {
    console.log("[DEBUG] Page 2FA détectée...");
    const backupCode = process.env.E2E_CLERK_2FA_BACKUP_CODE;
    if (!backupCode) {
      throw new Error(
        "Clerk demande une 2FA. Désactivez la 2FA pour le compte de test (Clerk Dashboard > Users) " +
        "ou ajoutez E2E_CLERK_2FA_BACKUP_CODE à .env.local avec un code de secours valide."
      );
    }
    // Screenshot pour debug
    await page.screenshot({ path: "test-results/2fa-page.png" });
    console.log("[DEBUG] Screenshot sauvegardé: test-results/2fa-page.png");
    
    const codeInput = page.locator(
      'input[name="code"], input[autocomplete="one-time-code"], input[inputmode="numeric"]'
    ).first();
    await expect(codeInput).toBeVisible({ timeout: 10_000 });
    await codeInput.fill(backupCode);
    console.log("[DEBUG] Code 2FA rempli:", backupCode);
    
    // Essayer de soumettre avec Enter (plus fiable que le bouton)
    await codeInput.press("Enter");
    console.log("[DEBUG] Enter pressé sur le champ 2FA");
    
    // Attendre un changement d'URL ou un message d'erreur
    await page.waitForTimeout(3000);
    console.log("[DEBUG] URL après soumission 2FA:", page.url());
    
    // Vérifier s'il y a un message d'erreur
    const errorMsg = page.locator('text=/incorrect|invalid|error|wrong/i').first();
    if (await errorMsg.isVisible()) {
      const errorText = await errorMsg.textContent();
      console.log("[DEBUG] ⚠️ Erreur 2FA détectée:", errorText);
      await page.screenshot({ path: "test-results/2fa-error.png" });
      throw new Error(
        `Code 2FA invalide: ${errorText}. ` +
        "Vérifiez E2E_CLERK_2FA_BACKUP_CODE dans .env.local ou désactivez la 2FA pour ce compte."
      );
    }
  }

  // Attendre la redirection vers localhost
  const url = new URL(page.url());
  console.log("[DEBUG] Attente redirection vers localhost...", url.hostname);
  await page.waitForURL((url) => url.hostname === "localhost", { timeout: 30_000 });
  console.log("[DEBUG] ✓ Redirigé vers:", page.url());

  console.log("[DEBUG] Recherche navbar-user-menu...");
  const userMenu = page.getByTestId("navbar-user-menu");
  await expect(userMenu).toBeVisible({ timeout: 30_000 });
  console.log("[DEBUG] ✓ navbar-user-menu visible");

  await page.waitForLoadState("networkidle");
  await expect(page).not.toHaveURL(/sign-in/);

  await page.context().storageState({ path: authFile });
  console.log("[DEBUG] ✓ Session sauvegardée:", authFile);
  console.log("[DEBUG] === FIN authenticate ===\n");
});