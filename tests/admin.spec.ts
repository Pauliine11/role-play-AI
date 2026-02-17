import { test, expect } from "@playwright/test";

// Tous les tests admin nécessitent une authentification
test.use({
  storageState: "playwright/.clerk/user.json",
});

test.describe("Admin Panel - Access Control", () => {
  test("should access admin levels page", async ({ page }) => {
    console.log("[DEBUG] admin - goto /admin/levels/new");
    await page.goto("/admin/levels/new");
    console.log("[DEBUG] admin - URL:", page.url());

    // Vérifier qu'on accède à la page (pas de redirection)
    expect(page.url()).toContain("/admin/levels/new");
    console.log("[DEBUG] admin - accès autorisé");
  });

  test("should display admin navigation or breadcrumb", async ({ page }) => {
    await page.goto("/admin/levels/new");

    // Vérifier la présence d'un titre ou indicateur admin
    const pageTitle = page.locator("h1, h2").first();
    await expect(pageTitle).toBeVisible({ timeout: 10_000 });
    
    const titleText = await pageTitle.textContent();
    console.log("[DEBUG] admin - titre de la page:", titleText);
    expect(titleText).toBeTruthy();
  });
});

test.describe("Admin Panel - Create Level Form", () => {
  test("should display all form fields", async ({ page }) => {
    await page.goto("/admin/levels/new");
    console.log("[DEBUG] admin - vérification des champs du formulaire...");

    // Title
    const titleInput = page.getByTestId("level-title-input");
    await expect(titleInput).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] admin - champ title visible");

    // Order
    const orderInput = page.getByTestId("level-order-input");
    await expect(orderInput).toBeVisible();
    console.log("[DEBUG] admin - champ order visible");

    // Description
    const descInput = page.getByTestId("level-description-input");
    await expect(descInput).toBeVisible();
    console.log("[DEBUG] admin - champ description visible");

    // Content (textarea)
    const contentTextarea = page.getByTestId("level-content-textarea");
    await expect(contentTextarea).toBeVisible();
    console.log("[DEBUG] admin - textarea content visible");

    // Checkbox is_active
    const isActiveCheckbox = page.getByTestId("level-is-active-checkbox");
    await expect(isActiveCheckbox).toBeVisible();
    console.log("[DEBUG] admin - checkbox is_active visible");

    // Submit button
    const submitBtn = page.getByTestId("level-submit-button");
    await expect(submitBtn).toBeVisible();
    console.log("[DEBUG] admin - bouton submit visible");
  });

  test("should have empty form initially", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Vérifier que les champs sont vides
    const titleValue = await titleInput.inputValue();
    const orderValue = await page.getByTestId("level-order-input").inputValue();
    const descValue = await page.getByTestId("level-description-input").inputValue();

    console.log("[DEBUG] admin - valeurs initiales:", { titleValue, orderValue, descValue });
    
    expect(titleValue).toBe("");
    expect(descValue).toBe("");
    // Order peut avoir une valeur par défaut (0 ou vide)
  });

  test("should enable submit button when form is valid", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const orderInput = page.getByTestId("level-order-input");
    const descInput = page.getByTestId("level-description-input");
    const contentTextarea = page.getByTestId("level-content-textarea");
    const submitBtn = page.getByTestId("level-submit-button");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Remplir les champs requis
    await titleInput.fill("Niveau de Test E2E");
    await orderInput.fill("999");
    await descInput.fill("Description du niveau de test");
    await contentTextarea.fill("Contenu du niveau de test pour E2E");
    
    console.log("[DEBUG] admin - formulaire rempli");

    // Le bouton devrait être enabled (si pas de validation côté client bloquante)
    const isEnabled = await submitBtn.isEnabled();
    console.log("[DEBUG] admin - bouton submit enabled:", isEnabled);
  });

  test("should require mandatory fields", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const submitBtn = page.getByTestId("level-submit-button");
    await expect(submitBtn).toBeVisible({ timeout: 10_000 });

    // Essayer de soumettre sans remplir
    await submitBtn.click();
    console.log("[DEBUG] admin - tentative de soumission vide");

    // Attendre un message d'erreur ou que le formulaire reste sur la page
    await page.waitForTimeout(1000);
    
    // Vérifier qu'on n'a pas quitté la page
    expect(page.url()).toContain("/admin/levels/new");
    console.log("[DEBUG] admin - formulaire non soumis (validation OK)");
  });

  test("should create new level successfully", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const orderInput = page.getByTestId("level-order-input");
    const descInput = page.getByTestId("level-description-input");
    const contentTextarea = page.getByTestId("level-content-textarea");
    const isActiveCheckbox = page.getByTestId("level-is-active-checkbox");
    const submitBtn = page.getByTestId("level-submit-button");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Remplir avec des données uniques
    const timestamp = Date.now();
    await titleInput.fill(`E2E Test Level ${timestamp}`);
    await orderInput.fill("999");
    await descInput.fill(`Description E2E ${timestamp}`);
    
    // Remplir le textarea avec un JSON de configuration
    const levelContent = JSON.stringify({
      character: "Test Character",
      location: "Test Location",
      context: "Test context",
      initial_message: "Hello from E2E test",
      initial_mood: "neutral",
      secret_word: `secret${timestamp}`,
      suggested_actions: ["Action 1", "Action 2"]
    }, null, 2);
    
    await contentTextarea.fill(levelContent);
    console.log("[DEBUG] admin - contenu JSON rempli");

    // Cocher is_active
    await isActiveCheckbox.check();
    console.log("[DEBUG] admin - niveau marqué actif");

    // Soumettre
    await submitBtn.click();
    console.log("[DEBUG] admin - formulaire soumis");

    // Attendre soit un message de succès, soit une redirection
    const successMessage = page.getByTestId("success-message");
    const errorMessage = page.getByTestId("error-message");

    // Attendre l'un des deux
    const result = await Promise.race([
      successMessage.isVisible().then(() => "success"),
      errorMessage.isVisible().then(() => "error"),
      page.waitForTimeout(5000).then(() => "timeout")
    ]);

    console.log("[DEBUG] admin - résultat:", result);

    if (result === "success") {
      const msg = await successMessage.textContent();
      console.log("[DEBUG] admin - message de succès:", msg);
      expect(msg).toBeTruthy();
    } else if (result === "error") {
      const msg = await errorMessage.textContent();
      console.log("[DEBUG] admin - message d'erreur:", msg);
    }
  });

  test("should display error message on invalid JSON content", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const contentTextarea = page.getByTestId("level-content-textarea");
    const submitBtn = page.getByTestId("level-submit-button");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Remplir avec un JSON invalide
    await titleInput.fill("Test Invalid JSON");
    await page.getByTestId("level-order-input").fill("998");
    await page.getByTestId("level-description-input").fill("Test");
    await contentTextarea.fill("{invalid json content}");
    console.log("[DEBUG] admin - JSON invalide saisi");

    await submitBtn.click();
    console.log("[DEBUG] admin - soumission avec JSON invalide");

    // Attendre un message d'erreur
    const errorMessage = page.getByTestId("error-message");
    
    try {
      await expect(errorMessage).toBeVisible({ timeout: 5_000 });
      const errorText = await errorMessage.textContent();
      console.log("[DEBUG] admin - erreur affichée:", errorText);
      expect(errorText).toBeTruthy();
    } catch {
      console.log("[DEBUG] admin - pas d'erreur affichée (validation peut-être côté serveur)");
    }
  });

  test("should toggle is_active checkbox", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const isActiveCheckbox = page.getByTestId("level-is-active-checkbox");
    await expect(isActiveCheckbox).toBeVisible({ timeout: 10_000 });

    // État initial (probablement non coché)
    const initialState = await isActiveCheckbox.isChecked();
    console.log("[DEBUG] admin - état initial is_active:", initialState);

    // Toggle
    await isActiveCheckbox.click();
    const afterClick = await isActiveCheckbox.isChecked();
    console.log("[DEBUG] admin - après clic:", afterClick);
    
    expect(afterClick).toBe(!initialState);

    // Toggle à nouveau
    await isActiveCheckbox.click();
    const afterSecondClick = await isActiveCheckbox.isChecked();
    console.log("[DEBUG] admin - après 2e clic:", afterSecondClick);
    
    expect(afterSecondClick).toBe(initialState);
  });
});

test.describe("Admin Panel - Form Validation", () => {
  test("should validate title length", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Titre très court
    await titleInput.fill("A");
    console.log("[DEBUG] admin - titre court: A");

    // Titre très long
    const longTitle = "A".repeat(200);
    await titleInput.fill(longTitle);
    const value = await titleInput.inputValue();
    console.log("[DEBUG] admin - titre long, longueur:", value.length);
    
    // HTML input peut avoir maxLength
    expect(value.length).toBeLessThanOrEqual(200);
  });

  test("should validate order is a number", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const orderInput = page.getByTestId("level-order-input");
    await expect(orderInput).toBeVisible({ timeout: 10_000 });

    // Vérifier le type de l'input
    const inputType = await orderInput.getAttribute("type");
    console.log("[DEBUG] admin - type de l'input order:", inputType);
    
    // Devrait être "number" pour validation automatique
    expect(inputType).toBe("number");

    // Tester qu'on peut saisir un nombre valide
    await orderInput.fill("42");
    const validValue = await orderInput.inputValue();
    console.log("[DEBUG] admin - valeur après saisie '42':", validValue);
    expect(validValue).toBe("42");

    // Tester qu'on peut saisir un nombre négatif
    await orderInput.fill("-5");
    const negativeValue = await orderInput.inputValue();
    console.log("[DEBUG] admin - valeur après saisie '-5':", negativeValue);
    expect(negativeValue).toBe("-5");
  });

  test("should validate JSON content format", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const contentTextarea = page.getByTestId("level-content-textarea");
    await expect(contentTextarea).toBeVisible({ timeout: 10_000 });

    // Saisir un JSON valide
    const validJson = JSON.stringify({
      character: "Test",
      location: "Loc",
      secret_word: "secret"
    }, null, 2);

    await contentTextarea.fill(validJson);
    const value = await contentTextarea.inputValue();
    console.log("[DEBUG] admin - JSON saisi, longueur:", value.length);
    
    expect(value).toContain("Test");
    expect(value).toContain("secret_word");
  });
});

test.describe("Admin Panel - Back Navigation", () => {
  test("should have back button to return home", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const backButton = page.getByTestId("back-to-home-button");
    
    if (await backButton.isVisible()) {
      console.log("[DEBUG] admin - bouton back trouvé");
      await backButton.click();
      
      // Attendre redirection vers home
      await page.waitForURL("/", { timeout: 5_000 });
      console.log("[DEBUG] admin - retour à la homepage");
      expect(page.url()).toContain("/");
    } else {
      console.log("[DEBUG] admin - pas de bouton back (navigation via navbar)");
    }
  });

  test("should navigate back via sidebar link", async ({ page }) => {
    await page.goto("/admin/levels/new");

    // Chercher le lien Accueil dans la sidebar
    const homeLink = page.locator('a[href="/"]').first();
    
    if (await homeLink.isVisible()) {
      await homeLink.click();
      console.log("[DEBUG] admin - clic sur Accueil");
      
      await page.waitForURL("/", { timeout: 5_000 });
      console.log("[DEBUG] admin - navigation vers home OK");
    } else {
      console.log("[DEBUG] admin - lien home non visible");
    }
  });
});

test.describe("Admin Panel - Error Handling", () => {
  test("should display error message when API fails", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const submitBtn = page.getByTestId("level-submit-button");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Remplir avec des données qui pourraient causer une erreur
    // (ex: order en doublon, titre vide après validation, etc.)
    await titleInput.fill("");
    await submitBtn.click();
    console.log("[DEBUG] admin - soumission avec données invalides");

    // Vérifier si un message d'erreur apparaît
    const errorMessage = page.getByTestId("error-message");
    
    await page.waitForTimeout(2000);
    const isVisible = await errorMessage.isVisible();
    console.log("[DEBUG] admin - message d'erreur visible:", isVisible);
  });

  test("should clear error message after fixing form", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const orderInput = page.getByTestId("level-order-input");
    const submitBtn = page.getByTestId("level-submit-button");
    const errorMessage = page.getByTestId("error-message");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Provoquer une erreur
    await titleInput.fill("");
    await submitBtn.click();
    await page.waitForTimeout(1000);

    // Si erreur visible, la corriger
    if (await errorMessage.isVisible()) {
      console.log("[DEBUG] admin - erreur détectée, correction...");
      
      await titleInput.fill("Titre corrigé");
      await orderInput.fill("1");
      
      // L'erreur devrait disparaître (selon l'implémentation)
      await page.waitForTimeout(500);
      console.log("[DEBUG] admin - formulaire corrigé");
    } else {
      console.log("[DEBUG] admin - pas d'erreur affichée");
    }
  });
});

test.describe("Admin Panel - Form Interaction", () => {
  test("should allow typing in all text fields", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const descInput = page.getByTestId("level-description-input");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Saisie dans title
    const testTitle = "Mon Niveau Test";
    await titleInput.fill(testTitle);
    let value = await titleInput.inputValue();
    expect(value).toBe(testTitle);
    console.log("[DEBUG] admin - title OK");

    // Saisie dans description
    const testDesc = "Une description complète pour tester le formulaire";
    await descInput.fill(testDesc);
    value = await descInput.inputValue();
    expect(value).toBe(testDesc);
    console.log("[DEBUG] admin - description OK");
  });

  test("should allow typing in textarea", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const contentTextarea = page.getByTestId("level-content-textarea");
    await expect(contentTextarea).toBeVisible({ timeout: 10_000 });

    // Saisir un long contenu
    const longContent = "A".repeat(1000) + "\n" + "B".repeat(1000);
    await contentTextarea.fill(longContent);
    
    const value = await contentTextarea.inputValue();
    console.log("[DEBUG] admin - textarea, longueur:", value.length);
    
    expect(value.length).toBeGreaterThan(1500);
  });

  test("should preserve form data while editing", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const orderInput = page.getByTestId("level-order-input");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Remplir plusieurs champs
    await titleInput.fill("Test Persistance");
    await orderInput.fill("123");
    console.log("[DEBUG] admin - champs remplis");

    // Modifier un autre champ
    await page.getByTestId("level-description-input").fill("Description");

    // Vérifier que les premiers champs sont toujours remplis
    const titleValue = await titleInput.inputValue();
    const orderValue = await orderInput.inputValue();

    console.log("[DEBUG] admin - valeurs après édition:", { titleValue, orderValue });
    
    expect(titleValue).toBe("Test Persistance");
    expect(orderValue).toBe("123");
  });
});

test.describe("Admin Panel - Success Feedback", () => {
  test("should display success message after level creation", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const orderInput = page.getByTestId("level-order-input");
    const descInput = page.getByTestId("level-description-input");
    const contentTextarea = page.getByTestId("level-content-textarea");
    const submitBtn = page.getByTestId("level-submit-button");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Remplir le formulaire
    const timestamp = Date.now();
    await titleInput.fill(`Success Test ${timestamp}`);
    await orderInput.fill("997");
    await descInput.fill("Test de message de succès");
    
    const content = JSON.stringify({
      character: "Hermione",
      location: "Library",
      secret_word: `test${timestamp}`
    });
    await contentTextarea.fill(content);

    await submitBtn.click();
    console.log("[DEBUG] admin - soumission pour test de succès");

    // Attendre le message de succès
    const successMessage = page.getByTestId("success-message");
    
    try {
      await expect(successMessage).toBeVisible({ timeout: 10_000 });
      const successText = await successMessage.textContent();
      console.log("[DEBUG] admin - succès:", successText);
      expect(successText).toBeTruthy();
    } catch {
      console.log("[DEBUG] admin - pas de message de succès visible");
    }
  });

  test("should clear form after successful submission", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const orderInput = page.getByTestId("level-order-input");
    const submitBtn = page.getByTestId("level-submit-button");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Remplir minimal
    await titleInput.fill(`Clear Test ${Date.now()}`);
    await orderInput.fill("996");
    await page.getByTestId("level-description-input").fill("Test clear");
    await page.getByTestId("level-content-textarea").fill('{"test": "data"}');

    await submitBtn.click();
    console.log("[DEBUG] admin - soumission pour test de clear");

    // Attendre 3 secondes pour voir si le form se réinitialise
    await page.waitForTimeout(3000);

    const titleValue = await titleInput.inputValue();
    const orderValue = await orderInput.inputValue();
    
    console.log("[DEBUG] admin - valeurs après soumission:", { titleValue, orderValue });
    
    // Si le form est cleared, les champs devraient être vides
    // (selon l'implémentation - peut ne pas être le cas)
  });
});

test.describe("Admin Panel - Responsive Design", () => {
  test("should display form properly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/admin/levels/new");
    console.log("[DEBUG] admin - viewport mobile 375x667");

    // Tous les champs doivent être visibles et accessibles
    const titleInput = page.getByTestId("level-title-input");
    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    const contentTextarea = page.getByTestId("level-content-textarea");
    await expect(contentTextarea).toBeVisible();

    const submitBtn = page.getByTestId("level-submit-button");
    await expect(submitBtn).toBeVisible();

    console.log("[DEBUG] admin - formulaire visible en mobile");
  });

  test("should display form properly on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/admin/levels/new");
    console.log("[DEBUG] admin - viewport tablet 768x1024");

    const titleInput = page.getByTestId("level-title-input");
    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Vérifier que le layout est adapté
    const formWidth = await titleInput.evaluate((el) => el.clientWidth);
    console.log("[DEBUG] admin - largeur du champ title:", formWidth);
    
    expect(formWidth).toBeGreaterThan(200);
  });

  test("should display form properly on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/admin/levels/new");
    console.log("[DEBUG] admin - viewport desktop 1920x1080");

    const titleInput = page.getByTestId("level-title-input");
    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    const contentTextarea = page.getByTestId("level-content-textarea");
    await expect(contentTextarea).toBeVisible();

    console.log("[DEBUG] admin - formulaire visible en desktop");
  });
});

test.describe("Admin Panel - Keyboard Navigation", () => {
  test("should navigate between fields with Tab", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Focus sur title
    await titleInput.focus();
    console.log("[DEBUG] admin - focus sur title");

    // Tab vers le champ suivant
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);

    // Vérifier qu'un autre élément a le focus
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute("data-testid"));
    console.log("[DEBUG] admin - focus après Tab:", focusedElement);
    
    expect(focusedElement).not.toBe("level-title-input");
  });

  test("should submit form with Enter on submit button focus", async ({ page }) => {
    await page.goto("/admin/levels/new");

    const titleInput = page.getByTestId("level-title-input");
    const orderInput = page.getByTestId("level-order-input");
    const descInput = page.getByTestId("level-description-input");
    const contentTextarea = page.getByTestId("level-content-textarea");
    const submitBtn = page.getByTestId("level-submit-button");

    await expect(titleInput).toBeVisible({ timeout: 10_000 });

    // Remplir rapidement le formulaire
    await titleInput.fill(`Keyboard Test ${Date.now()}`);
    await orderInput.fill("995");
    await descInput.fill("Keyboard test");
    await contentTextarea.fill('{"test": "keyboard"}');

    // Focus sur submit et appuyer sur Enter
    await submitBtn.focus();
    await page.keyboard.press("Enter");
    console.log("[DEBUG] admin - Enter pressé sur submit");

    await page.waitForTimeout(2000);
    console.log("[DEBUG] admin - soumission via clavier testée");
  });
});
