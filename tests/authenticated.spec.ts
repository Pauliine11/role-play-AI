import { test } from "@playwright/test";

test.describe("authenticated tests", () => {
  test("already signed in", async ({ page }) => {
    console.log("[DEBUG] authenticated - goto /game");
    await page.goto("/game");
    console.log("[DEBUG] authenticated - URL:", page.url());
    
    // Vérifier que la navbar utilisateur est visible (= authentifié)
    await page.waitForSelector('[data-testid="navbar-user-menu"]', { timeout: 10_000 });
    console.log("[DEBUG] authenticated - navbar-user-menu visible");
    
    // Vérifier qu'on est sur la page du jeu
    await page.waitForSelector('[data-testid="character-name"]', { timeout: 10_000 });
    console.log("[DEBUG] authenticated - page game chargée");
  });
});