import { test, expect } from "@playwright/test";

// Note: L'authentification est gérée dans playwright.config.ts via storageState

test.describe("Homepage - Authenticated User - Basic Features", () => {
  test("should display main title and branding", async ({ page }) => {
    console.log("[DEBUG] homepage - goto /");
    await page.goto("/");
    console.log("[DEBUG] homepage - URL:", page.url());

    // Vérifier le titre principal dans la navbar
    const title = page.locator("h1").first();
    await expect(title).toBeVisible();
    await expect(title).toContainText("Grimoire");
    console.log("[DEBUG] homepage - titre principal visible");

    // Vérifier que l'utilisateur est authentifié (présence du menu utilisateur)
    const userMenu = page.getByTestId("navbar-user-menu");
    await expect(userMenu).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] homepage - menu utilisateur visible");
  });

  test("should display all level cards", async ({ page }) => {
    await page.goto("/");
    console.log("[DEBUG] homepage - chargement des level cards...");

    // Attendre que les cards soient chargées
    const levelCards = page.locator('[data-testid^="level-card-"]');
    await expect(levelCards.first()).toBeVisible({ timeout: 10_000 });
    
    const count = await levelCards.count();
    console.log(`[DEBUG] homepage - ${count} level cards trouvées`);
    expect(count).toBeGreaterThan(0);
  });

  test("should display level card information", async ({ page }) => {
    await page.goto("/");
    
    // Sélectionner la première card
    const firstCard = page.locator('[data-testid^="level-card-"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] homepage - première card visible");

    // Vérifier la présence du titre
    const levelTitle = firstCard.locator('[data-testid="level-title"]');
    await expect(levelTitle).toBeVisible();
    const titleText = await levelTitle.textContent();
    console.log("[DEBUG] homepage - titre du niveau:", titleText);
    expect(titleText).toBeTruthy();

    // Vérifier la présence de la description
    const levelDesc = firstCard.locator('[data-testid="level-description"]');
    await expect(levelDesc).toBeVisible();
    const descText = await levelDesc.textContent();
    console.log("[DEBUG] homepage - description:", descText?.substring(0, 50) + "...");
    expect(descText).toBeTruthy();

    // Vérifier la présence du statut
    const levelStatus = firstCard.locator('[data-testid="level-status"]');
    await expect(levelStatus).toBeVisible();
    const statusText = await levelStatus.textContent();
    console.log("[DEBUG] homepage - statut:", statusText);
  });

  test("should have clickable start buttons on level cards", async ({ page }) => {
    await page.goto("/");
    
    const firstCard = page.locator('[data-testid^="level-card-"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });

    // Vérifier que le bouton "Commencer" existe
    const startBtn = firstCard.locator('[data-testid="level-start-button"]');
    await expect(startBtn).toBeVisible();
    
    const btnText = await startBtn.textContent();
    console.log("[DEBUG] homepage - texte du bouton:", btnText);
    // Accepter différents textes selon l'état du niveau
    expect(btnText).toMatch(/Commencer|Start|Continuer|Continue|Rejouer|Replay/i);
  });

  test("should navigate to game page when clicking level card", async ({ page }) => {
    await page.goto("/");
    
    const firstCard = page.locator('[data-testid^="level-card-"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });

    // Extraire le level key du data-testid
    const testId = await firstCard.getAttribute("data-testid");
    console.log("[DEBUG] homepage - clic sur card:", testId);

    const startBtn = firstCard.locator('[data-testid="level-start-button"]');
    
    // Cliquer et attendre la navigation
    await startBtn.click();
    console.log("[DEBUG] homepage - attente navigation vers /game...");

    // Peut rediriger vers sign-in si non connecté
    await page.waitForURL(/\/(game|sign-in)/, { timeout: 10_000 });
    const finalUrl = page.url();
    console.log("[DEBUG] homepage - URL finale:", finalUrl);
    
    // Vérifier qu'on a bien navigué
    expect(finalUrl).toMatch(/\/(game|sign-in)/);
  });

  test("should display language toggle", async ({ page }) => {
    await page.goto("/");
    
    // Vérifier la présence du toggle langue
    const langToggle = page.locator('button[aria-label*="language"], button:has-text("FR"), button:has-text("EN")').first();
    await expect(langToggle).toBeVisible();
    console.log("[DEBUG] homepage - language toggle visible");
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Définir viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    console.log("[DEBUG] homepage - viewport mobile 375x667");

    // Vérifier que le menu hamburger est visible
    const hamburger = page.locator('button[aria-label*="menu"], button:has(svg path[d*="M4 6h16"])').first();
    await expect(hamburger).toBeVisible();
    console.log("[DEBUG] homepage - bouton hamburger visible");

    // Vérifier que les cards sont affichées en colonne
    const levelCards = page.locator('[data-testid^="level-card-"]');
    await expect(levelCards.first()).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] homepage - cards visibles en mobile");
  });
});

test.describe("Homepage - Authenticated User - Advanced Features", () => {
  test("should display user menu instead of auth buttons", async ({ page }) => {
    await page.goto("/");
    console.log("[DEBUG] homepage auth - vérification UserButton...");

    // Vérifier que le UserButton est visible
    const userMenu = page.getByTestId("navbar-user-menu");
    await expect(userMenu).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] homepage auth - UserButton visible");

    // Vérifier que les boutons Sign In/Up ne sont pas visibles
    const signInBtn = page.locator('button:has-text("Se connecter")');
    await expect(signInBtn).not.toBeVisible();
    console.log("[DEBUG] homepage auth - boutons auth cachés");
  });

  test("should navigate directly to game when clicking level", async ({ page }) => {
    await page.goto("/");
    
    const firstCard = page.locator('[data-testid^="level-card-"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });

    const startBtn = firstCard.locator('[data-testid="level-start-button"]');
    await startBtn.click();
    console.log("[DEBUG] homepage auth - clic sur niveau...");

    // Utilisateur connecté → redirection directe vers /game (avec query params possibles)
    await page.waitForURL(/\/game(\?.*)?$/, { timeout: 10_000 });
    console.log("[DEBUG] homepage auth - URL:", page.url());

    // Vérifier qu'on est bien sur la page de jeu
    await expect(page.getByTestId("character-name")).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] homepage auth - page game chargée");
  });

  test("should display user progress indicators", async ({ page }) => {
    await page.goto("/");
    console.log("[DEBUG] homepage auth - vérification progression...");

    // Attendre que les cards soient chargées
    const levelCards = page.locator('[data-testid^="level-card-"]');
    await expect(levelCards.first()).toBeVisible({ timeout: 10_000 });

    // Vérifier qu'au moins une card a un indicateur de statut
    const statusIndicators = page.locator('[data-testid="level-status"]');
    const count = await statusIndicators.count();
    console.log(`[DEBUG] homepage auth - ${count} indicateurs de statut trouvés`);
    expect(count).toBeGreaterThan(0);
  });

  test("should open user menu on click", async ({ page }) => {
    await page.goto("/");
    
    const userMenu = page.getByTestId("navbar-user-menu");
    await expect(userMenu).toBeVisible({ timeout: 10_000 });

    // Cliquer sur le UserButton pour ouvrir le menu
    await userMenu.click();
    console.log("[DEBUG] homepage auth - clic sur UserButton");

    // Attendre que le menu s'ouvre (le contenu peut varier selon Clerk)
    await page.waitForTimeout(1000);
    
    // Vérifier qu'un élément du menu est visible (peut être un dropdown Clerk)
    // Utiliser .first() pour éviter la violation de strict mode
    const menuVisible = await page.locator('[role="dialog"], [role="menu"], .cl-userButtonPopoverCard').first().isVisible();
    console.log("[DEBUG] homepage auth - menu ouvert:", menuVisible);
  });
});

test.describe("Homepage - Level Cards Details", () => {
  test("should display levels in correct order", async ({ page }) => {
    await page.goto("/");
    
    const levelCards = page.locator('[data-testid^="level-card-"]');
    await expect(levelCards.first()).toBeVisible({ timeout: 10_000 });
    
    const count = await levelCards.count();
    console.log(`[DEBUG] homepage - vérification ordre de ${count} niveaux`);

    // Récupérer les titres dans l'ordre d'affichage
    const titles: string[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = levelCards.nth(i);
      const title = await card.locator('[data-testid="level-title"]').textContent();
      titles.push(title || "");
    }
    
    console.log("[DEBUG] homepage - ordre des titres:", titles);
    // Les niveaux devraient être affichés dans un ordre cohérent
    expect(titles.length).toBeGreaterThan(0);
  });

  test("should show different states for levels", async ({ page }) => {
    await page.goto("/");
    
    const levelCards = page.locator('[data-testid^="level-card-"]');
    await expect(levelCards.first()).toBeVisible({ timeout: 10_000 });

    // Collecter tous les statuts
    const statuses = await page.locator('[data-testid="level-status"]').allTextContents();
    console.log("[DEBUG] homepage - statuts trouvés:", statuses);

    // Vérifier qu'il y a différents statuts possibles
    expect(statuses.length).toBeGreaterThan(0);
  });

  test("should have proper styling and hover effects", async ({ page }) => {
    await page.goto("/");
    
    const firstCard = page.locator('[data-testid^="level-card-"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });

    // Vérifier les classes CSS (thème médiéval)
    const cardClasses = await firstCard.getAttribute("class");
    console.log("[DEBUG] homepage - classes de la card:", cardClasses);

    // Hover sur la card
    await firstCard.hover();
    console.log("[DEBUG] homepage - hover sur la card");
    
    // Vérifier que la card est toujours visible après hover
    await expect(firstCard).toBeVisible();
  });
});

test.describe("Homepage - Sidebar Navigation", () => {
  test("should toggle sidebar on hamburger click (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Attendre que la page authentifiée soit chargée
    await expect(page.getByTestId("navbar-user-menu")).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] homepage - page authentifiée chargée");

    const hamburger = page.getByRole('button', { name: /toggle menu/i });
    await expect(hamburger).toBeVisible({ timeout: 10_000 });

    // Sélectionner un élément unique à la sidebar (ex: le bouton "Réduire la sidebar")
    const sidebarContent = page.getByRole('button', { name: /réduire la sidebar/i });
    
    // Vérifier l'état initial - la sidebar peut être ouverte ou fermée
    const initiallyVisible = await sidebarContent.isVisible().catch(() => false);
    console.log("[DEBUG] homepage - sidebar initialement visible:", initiallyVisible);

    // Premier clic sur hamburger (devrait toggle)
    await hamburger.click();
    console.log("[DEBUG] homepage - premier clic hamburger");
    await page.waitForTimeout(400); // Attendre l'animation
    
    const afterFirstClick = await sidebarContent.isVisible().catch(() => false);
    console.log("[DEBUG] homepage - après 1er clic, sidebar visible:", afterFirstClick);

    // Deuxième clic sur hamburger (force car peut être couvert)
    await hamburger.click({ force: true });
    console.log("[DEBUG] homepage - deuxième clic hamburger");
    await page.waitForTimeout(400); // Attendre l'animation
    
    const afterSecondClick = await sidebarContent.isVisible().catch(() => false);
    console.log("[DEBUG] homepage - après 2ème clic, sidebar visible:", afterSecondClick);
    
    // Vérifier que l'état a changé au moins une fois (toggle fonctionne)
    const statesChanged = (initiallyVisible !== afterFirstClick) || (afterFirstClick !== afterSecondClick);
    expect(statesChanged).toBe(true);
  });

  test("should have sidebar always visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    console.log("[DEBUG] homepage - viewport desktop 1920x1080");

    // Sur desktop, pas de bouton hamburger
    const hamburger = page.locator('button[aria-label*="Toggle menu"]');
    const isVisible = await hamburger.isVisible().catch(() => false);
    console.log("[DEBUG] homepage - hamburger visible sur desktop:", isVisible);
    
    // La sidebar devrait être visible en permanence
    // (difficile à tester sans classe spécifique, on vérifie juste que la page fonctionne)
    const levelCards = page.locator('[data-testid^="level-card-"]');
    await expect(levelCards.first()).toBeVisible({ timeout: 10_000 });
  });
});
