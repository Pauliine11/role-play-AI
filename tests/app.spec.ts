import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { test, expect } from "@playwright/test";

test.describe.configure({
  mode: "serial",
});

test.describe("main tests", () => {
  test("sign in", async ({ page }) => {
    console.log("[DEBUG] sign in - setupClerkTestingToken...");
    await setupClerkTestingToken({ page });

    console.log("[DEBUG] sign in - goto /game");
    await page.goto("/game");
    console.log("[DEBUG] sign in - URL:", page.url());

    // Si non connecté, redirigé vers sign-in
    await expect(page.locator("h1")).toContainText("Sign in");
    console.log("[DEBUG] sign in - h1 OK");

    await page.waitForSelector(".cl-signIn-root", { state: "attached" });
    console.log("[DEBUG] sign in - .cl-signIn-root trouvé");

    await page
      .locator("input[name=identifier]")
      .fill(process.env.E2E_CLERK_USER_EMAIL!);
    console.log("[DEBUG] sign in - email rempli");

    await page.getByRole("button", { name: "Continue", exact: true }).click();

    await page
      .locator("input[name=password]")
      .fill(process.env.E2E_CLERK_USER_PASSWORD!);
    console.log("[DEBUG] sign in - password rempli");

    await page.getByRole("button", { name: "Continue", exact: true }).click();
    console.log("[DEBUG] sign in - formulaire soumis, attente redirection...");

    // Attendre redirection vers game
    await page.waitForURL("/game");
    console.log("[DEBUG] sign in - URL finale:", page.url());
    
    // Vérifier qu'on est bien sur la page du jeu
    await page.waitForSelector('[data-testid="character-name"]', { timeout: 10_000 });
    console.log("[DEBUG] sign in - page game chargée");
  });

  // TODO: Adapter ces tests pour l'architecture de l'app (pas de /protected, /sign-up en modal)
  test.skip("sign up", async ({ page }) => {
    console.log("[DEBUG] sign up - setupClerkTestingToken...");
    await setupClerkTestingToken({ page });

    console.log("[DEBUG] sign up - goto /sign-up");
    await page.goto("/sign-up");
    console.log("[DEBUG] sign up - URL:", page.url());

    await clerk.loaded({ page });
    await page.waitForSelector(".cl-signUp-root", { state: "attached" });
    console.log("[DEBUG] sign up - .cl-signUp-root trouvé");

    const username = "user" + Date.now();
    const pwd = "Pass!@" + Date.now();
    await page.locator("input[name=username]").fill(username);
    await page.locator("input[name=password]").fill(pwd);
    console.log("[DEBUG] sign up - username/password remplis");

    await page.getByRole("button", { name: "Continue", exact: true }).click();
    console.log("[DEBUG] sign up - formulaire soumis...");

    await page.waitForURL("**/game");
    console.log("[DEBUG] sign up - URL finale:", page.url());
  });

  test.skip("sign in using helper", async ({ page }) => {
    console.log("[DEBUG] sign in helper - goto /");
    await page.goto("/");
    console.log("[DEBUG] sign in helper - clerk.signIn(password)...");

    await clerk.signIn({
      page,
      signInParams: {
        strategy: "password",
        identifier: process.env.E2E_CLERK_USER_EMAIL!,
        password: process.env.E2E_CLERK_USER_PASSWORD!,
      },
    });
    console.log("[DEBUG] sign in helper - signIn OK, URL:", page.url());

    await page.goto("/game");
    console.log("[DEBUG] sign in helper - goto /game, URL:", page.url());

    await page.waitForSelector('[data-testid="character-name"]');
    console.log("[DEBUG] sign in helper - page game trouvée");
  });

  test.skip("sign out using helpers", async ({ page }) => {
    console.log("[DEBUG] sign out - goto /");
    await page.goto("/");

    await clerk.signIn({
      page,
      signInParams: {
        strategy: "password",
        identifier: process.env.E2E_CLERK_USER_EMAIL!,
        password: process.env.E2E_CLERK_USER_PASSWORD!,
      },
    });
    console.log("[DEBUG] sign out - signIn OK");

    await page.goto("/game");
    await page.waitForSelector('[data-testid="character-name"]');
    console.log("[DEBUG] sign out - page game OK");

    await clerk.signOut({ page });
    console.log("[DEBUG] sign out - signOut OK");

    await page.goto("/game");
    console.log("[DEBUG] sign out - goto /game après signOut, URL:", page.url());

    await page.waitForSelector("h1:has-text('Sign in')");
    console.log("[DEBUG] sign out - redirection sign-in OK");
  });
});