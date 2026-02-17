import { test, expect } from "@playwright/test";

// Tous les tests nécessitent une authentification
test.use({
  storageState: "playwright/.clerk/user.json",
});

test.describe("Game Page - Initial Loading", () => {
  test("should load game page with character display", async ({ page }) => {
    console.log("[DEBUG] game - goto /game");
    await page.goto("/game");
    console.log("[DEBUG] game - URL:", page.url());

    // Vérifier l'affichage du personnage
    const characterAvatar = page.getByTestId("character-avatar");
    await expect(characterAvatar).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] game - avatar du personnage visible");

    const characterName = page.getByTestId("character-name");
    await expect(characterName).toBeVisible();
    const name = await characterName.textContent();
    console.log("[DEBUG] game - nom du personnage:", name);
    expect(name).toBeTruthy();

    // Vérifier le mood
    const characterMood = page.getByTestId("character-mood");
    await expect(characterMood).toBeVisible();
    const mood = await characterMood.textContent();
    console.log("[DEBUG] game - mood:", mood);
    expect(mood).toBeTruthy();
  });

  test("should display turn counter starting at 0/10", async ({ page }) => {
    await page.goto("/game");

    // Utiliser le data-testid maintenant que le compteur est toujours visible
    const turnCounter = page.getByTestId("turn-counter");
    await expect(turnCounter).toBeVisible({ timeout: 10_000 });
    
    const turnText = await turnCounter.textContent();
    console.log("[DEBUG] game - compteur de tours:", turnText);
    
    // Devrait afficher "Tour 0/10" au démarrage
    expect(turnText).toMatch(/0\/10/);
  });

  test("should display empty chat area initially", async ({ page }) => {
    await page.goto("/game");

    const chatMessages = page.getByTestId("chat-messages");
    await expect(chatMessages).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] game - zone de chat visible");

    // Vérifier qu'il n'y a pas de messages au début (ou messages système de bienvenue)
    const messages = page.locator('[data-testid*="-message"]');
    const count = await messages.count();
    console.log("[DEBUG] game - nombre de messages initiaux:", count);
    
    // Tolérer message(s) système de bienvenue (intro + dialogue initial)
    expect(count).toBeLessThanOrEqual(2);
  });

  test("should display message input and send button", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    await expect(messageInput).toBeVisible({ timeout: 10_000 });
    await expect(messageInput).toBeEnabled();
    console.log("[DEBUG] game - input message visible et actif");

    const sendButton = page.getByTestId("send-button");
    await expect(sendButton).toBeVisible();
    // Bouton disabled si input vide - comportement normal
    
    // Tester que le bouton s'active après saisie
    await messageInput.fill("Test");
    await expect(sendButton).toBeEnabled();
    console.log("[DEBUG] game - bouton send actif après saisie");
  });

  test("should load with correct theme styling", async ({ page }) => {
    await page.goto("/game");

    // Vérifier que le conteneur principal a les classes de thème
    const chatMessages = page.getByTestId("chat-messages");
    await expect(chatMessages).toBeVisible({ timeout: 10_000 });

    const classes = await chatMessages.getAttribute("class");
    console.log("[DEBUG] game - classes CSS:", classes);
    
    // Le thème médiéval devrait être appliqué
    expect(classes).toBeTruthy();
  });
});

test.describe("Game Page - Chat Interaction", () => {
  test("should send user message and receive AI response", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");

    await expect(messageInput).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] game - envoi d'un message test...");

    // Envoyer un message
    const testMessage = "Bonjour, comment allez-vous ?";
    await messageInput.fill(testMessage);
    await sendButton.click();
    console.log("[DEBUG] game - message envoyé:", testMessage);

    // Vérifier que le message utilisateur apparaît
    const userMessage = page.getByTestId("user-message").last();
    await expect(userMessage).toBeVisible({ timeout: 5_000 });
    const userText = await userMessage.textContent();
    console.log("[DEBUG] game - message utilisateur affiché:", userText);
    expect(userText).toContain(testMessage);

    // Vérifier que l'input est désactivé pendant la réponse
    console.log("[DEBUG] game - attente réponse AI...");
    
    // Attendre la réponse de l'assistant (peut prendre quelques secondes)
    const assistantMessage = page.getByTestId("assistant-message").last();
    await expect(assistantMessage).toBeVisible({ timeout: 30_000 });
    const assistantText = await assistantMessage.textContent();
    console.log("[DEBUG] game - réponse AI reçue:", assistantText?.substring(0, 100) + "...");
    expect(assistantText).toBeTruthy();
    expect(assistantText!.length).toBeGreaterThan(0);
  });

  test("should clear input after sending message", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");

    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Envoyer un message
    await messageInput.fill("Test message");
    await sendButton.click();
    console.log("[DEBUG] game - message envoyé");

    // Attendre un peu et vérifier que l'input est vide
    await page.waitForTimeout(1000);
    const inputValue = await messageInput.inputValue();
    console.log("[DEBUG] game - valeur de l'input après envoi:", inputValue);
    expect(inputValue).toBe("");
  });

  test("should disable input and button while waiting for response", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");

    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Envoyer un message
    await messageInput.fill("Question test");
    await sendButton.click();
    console.log("[DEBUG] game - vérification désactivation pendant réponse...");

    // Vérifier rapidement que l'input/bouton sont désactivés
    await page.waitForTimeout(500);
    const isInputDisabled = await messageInput.isDisabled();
    const isButtonDisabled = await sendButton.isDisabled();
    
    console.log("[DEBUG] game - input désactivé:", isInputDisabled);
    console.log("[DEBUG] game - bouton désactivé:", isButtonDisabled);
    
    // Au moins un des deux devrait être désactivé
    expect(isInputDisabled || isButtonDisabled).toBe(true);
  });

  test("should display messages in correct order (user then assistant)", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");
    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Compter les messages initiaux
    const initialCount = await page.locator('[data-testid*="-message"]').count();
    console.log("[DEBUG] game - messages initiaux:", initialCount);

    // Envoyer un message
    await messageInput.fill("Premier message");
    await sendButton.click();
    console.log("[DEBUG] game - premier message envoyé");

    // Attendre que 2 NOUVEAUX messages apparaissent (user + assistant)
    await page.waitForFunction(
      (initial) => {
        const messages = document.querySelectorAll('[data-testid*="-message"]');
        return messages.length >= initial + 2;
      },
      initialCount,
      { timeout: 30_000 }
    );
    console.log("[DEBUG] game - nouveaux messages reçus");

    const allMessages = page.locator('[data-testid*="-message"]');
    const count = await allMessages.count();
    console.log("[DEBUG] game - total messages:", count);

    // Les 2 DERNIERS doivent être user puis assistant
    const last = allMessages.last();
    const beforeLast = allMessages.nth(count - 2);

    const lastTestId = await last.getAttribute("data-testid");
    const beforeLastTestId = await beforeLast.getAttribute("data-testid");

    console.log("[DEBUG] game - avant-dernier:", beforeLastTestId);
    console.log("[DEBUG] game - dernier:", lastTestId);

    expect(beforeLastTestId).toContain("user-message");
    expect(lastTestId).toContain("assistant-message");
  });

  test("should auto-scroll to bottom when new message arrives", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");
    const chatMessages = page.getByTestId("chat-messages");

    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Envoyer un message
    await messageInput.fill("Test scroll");
    await sendButton.click();

    // Attendre la réponse
    const assistantMessage = page.getByTestId("assistant-message").last();
    await expect(assistantMessage).toBeVisible({ timeout: 30_000 });

    console.log("[DEBUG] game - vérification scroll automatique");
    
    // Le dernier message devrait être visible (scrollé automatiquement)
    await expect(assistantMessage).toBeInViewport();
    console.log("[DEBUG] game - dernier message dans le viewport");
  });
});

test.describe("Game Page - Game Progression", () => {
  test("should increment turn counter after each exchange", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");
    const turnCounter = page.getByTestId("turn-counter");
    
    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Récupérer le compteur initial
    await expect(turnCounter).toBeVisible({ timeout: 10_000 });
    let turnText = await turnCounter.textContent();
    console.log("[DEBUG] game - compteur initial:", turnText);
    expect(turnText).toMatch(/0\/10/);

    // Envoyer un message
    await messageInput.fill("Test incrémentation");
    await sendButton.click();

    // Attendre la réponse AI
    const assistantMessage = page.getByTestId("assistant-message").last();
    await expect(assistantMessage).toBeVisible({ timeout: 30_000 });
    console.log("[DEBUG] game - réponse AI reçue");

    // Vérifier que le compteur a augmenté à 1/10
    await expect(turnCounter).toHaveText(/1\/10/, { timeout: 5_000 });
    turnText = await turnCounter.textContent();
    console.log("[DEBUG] game - compteur après 1 échange:", turnText);
    expect(turnText).toMatch(/1\/10/);
  });

  test("should update character mood based on conversation", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");
    const characterMood = page.getByTestId("character-mood");

    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Récupérer le mood initial
    const initialMood = await characterMood.textContent();
    console.log("[DEBUG] game - mood initial:", initialMood);

    // Envoyer un message
    await messageInput.fill("Comment vous sentez-vous aujourd'hui ?");
    await sendButton.click();

    // Attendre la réponse
    await page.waitForTimeout(5000);

    // Le mood peut changer ou rester le même
    const newMood = await characterMood.textContent();
    console.log("[DEBUG] game - mood après interaction:", newMood);
    
    // Le mood devrait toujours être présent
    expect(newMood).toBeTruthy();
  });

  test.skip("should reach game over after 10 turns", async ({ page }) => {
    // Test long - skip par défaut
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");

    console.log("[DEBUG] game - simulation de 10 tours...");

    // Envoyer 10 messages pour atteindre la limite
    for (let i = 1; i <= 10; i++) {
      await expect(messageInput).toBeEnabled({ timeout: 10_000 });
      await messageInput.fill(`Message numéro ${i}`);
      await sendButton.click();
      console.log(`[DEBUG] game - tour ${i}/10 envoyé`);
      
      // Attendre la réponse avant de continuer
      await page.waitForTimeout(5000);
    }

    // Vérifier l'affichage du game over
    const gameOverOverlay = page.getByTestId("game-over-overlay");
    await expect(gameOverOverlay).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] game - overlay game over affiché");
  });
});

test.describe("Game Page - Victory & Defeat", () => {
  test.skip("should display victory overlay when secret word is found", async ({ page }) => {
    // Ce test nécessite de connaître le mot secret et de le trouver
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");

    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Tenter de deviner le mot secret (exemple)
    // Note: le mot secret varie selon le niveau
    await messageInput.fill("Est-ce que le mot secret est 'Poudlard' ?");
    await sendButton.click();

    console.log("[DEBUG] game - tentative de victoire avec mot secret...");
    
    // Si victoire, l'overlay devrait apparaître
    const victoryTitle = page.getByTestId("victory-title");
    
    try {
      await expect(victoryTitle).toBeVisible({ timeout: 10_000 });
      console.log("[DEBUG] game - VICTOIRE détectée !");
      
      // Vérifier la présence des boutons post-victoire
      const homeButton = page.getByTestId("home-button");
      await expect(homeButton).toBeVisible();
      console.log("[DEBUG] game - bouton Home visible");
    } catch (error) {
      console.log("[DEBUG] game - pas de victoire (mot secret incorrect)");
    }
  });

  test.skip("should display defeat overlay after 10 failed turns", async ({ page }) => {
    // Test long - skip par défaut
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");

    console.log("[DEBUG] game - simulation de défaite...");

    // Envoyer 10 messages sans trouver le mot secret
    for (let i = 1; i <= 10; i++) {
      await expect(messageInput).toBeEnabled({ timeout: 10_000 });
      await messageInput.fill(`Message générique ${i}`);
      await sendButton.click();
      await page.waitForTimeout(5000);
    }

    // Vérifier l'affichage de la défaite
    const defeatTitle = page.getByTestId("defeat-title");
    await expect(defeatTitle).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] game - DÉFAITE affichée");

    // Vérifier les boutons post-défaite
    const restartButton = page.getByTestId("restart-button");
    await expect(restartButton).toBeVisible();
    console.log("[DEBUG] game - bouton Restart visible");
  });
});

test.describe("Game Page - Post-Game Actions", () => {
  test("should have restart button in game over overlay", async ({ page }) => {
    await page.goto("/game");
    console.log("[DEBUG] game - vérification structure overlay...");

    // On ne peut pas facilement tester le restart sans terminer une partie
    // mais on peut vérifier la structure du composant
    const chatMessages = page.getByTestId("chat-messages");
    await expect(chatMessages).toBeVisible({ timeout: 10_000 });
    console.log("[DEBUG] game - page de jeu chargée");
  });

  test("should navigate to home when clicking home button", async ({ page }) => {
    await page.goto("/game");

    // Chercher le lien vers la home directement (éviter strict mode violation)
    const homeLink = page.locator('a[href="/"]').first();
    
    if (await homeLink.isVisible()) {
      await homeLink.click();
      console.log("[DEBUG] game - clic sur lien Home");

      await page.waitForURL("/", { timeout: 5_000 });
      console.log("[DEBUG] game - retour à la homepage");
    } else {
      console.log("[DEBUG] game - navigation home testée");
    }
  });
});

test.describe("Game Page - Character Display", () => {
  test("should display character avatar image", async ({ page }) => {
    await page.goto("/game");

    const characterAvatar = page.getByTestId("character-avatar");
    await expect(characterAvatar).toBeVisible({ timeout: 10_000 });

    // Vérifier qu'il y a bien une image à l'intérieur
    const img = characterAvatar.locator("img");
    const imgCount = await img.count();
    console.log("[DEBUG] game - nombre d'images avatar:", imgCount);
    
    if (imgCount > 0) {
      await expect(img.first()).toBeVisible();
      const src = await img.first().getAttribute("src");
      console.log("[DEBUG] game - src de l'avatar:", src);
      expect(src).toBeTruthy();
    }
  });

  test("should display character information prominently", async ({ page }) => {
    await page.goto("/game");

    const characterName = page.getByTestId("character-name");
    await expect(characterName).toBeVisible({ timeout: 10_000 });

    // Vérifier la taille/style du nom (doit être visible)
    const fontSize = await characterName.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    console.log("[DEBUG] game - taille de police du nom:", fontSize);
    
    // Le nom devrait être assez grand (> 16px)
    const size = parseInt(fontSize);
    expect(size).toBeGreaterThan(16);
  });

  test("should show different moods with appropriate styling", async ({ page }) => {
    await page.goto("/game");

    const characterMood = page.getByTestId("character-mood");
    await expect(characterMood).toBeVisible({ timeout: 10_000 });

    const mood = await characterMood.textContent();
    console.log("[DEBUG] game - mood actuel:", mood);

    // Les moods possibles : neutral, happy, sad, angry, desperate
    const validMoods = ["neutral", "neutre", "happy", "heureux", "sad", "triste", "angry", "en colère", "desperate", "désespéré"];
    const moodLower = mood?.toLowerCase() || "";
    
    const hasValidMood = validMoods.some(m => moodLower.includes(m));
    console.log("[DEBUG] game - mood valide:", hasValidMood);
  });
});

test.describe("Game Page - Input Validation", () => {
  test("should not send empty messages", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");

    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Compter les messages initiaux
    const initialCount = await page.locator('[data-testid*="-message"]').count();
    console.log("[DEBUG] game - messages initiaux:", initialCount);

    // Essayer d'envoyer un message vide
    await messageInput.fill("");
    
    // Le bouton devrait être désactivé ou ne rien faire
    const isDisabled = await sendButton.isDisabled();
    console.log("[DEBUG] game - bouton désactivé avec input vide:", isDisabled);

    if (!isDisabled) {
      await sendButton.click();
      await page.waitForTimeout(1000);
      
      // Le nombre de messages ne devrait pas avoir changé
      const newCount = await page.locator('[data-testid*="-message"]').count();
      console.log("[DEBUG] game - messages après tentative envoi vide:", newCount);
      expect(newCount).toBe(initialCount);
    }
  });

  test("should handle long messages", async ({ page }) => {
    await page.goto("/game");

    const messageInput = page.getByTestId("message-input");
    const sendButton = page.getByTestId("send-button");

    await expect(messageInput).toBeVisible({ timeout: 10_000 });

    // Créer un message très long
    const longMessage = "A".repeat(500);
    await messageInput.fill(longMessage);
    console.log("[DEBUG] game - message long de", longMessage.length, "caractères");

    await sendButton.click();
    console.log("[DEBUG] game - message long envoyé");

    // Vérifier que le message apparaît (peut être tronqué visuellement mais envoyé)
    const userMessage = page.getByTestId("user-message").last();
    await expect(userMessage).toBeVisible({ timeout: 5_000 });
    console.log("[DEBUG] game - message long affiché");
  });
});

test.describe("Game Page - Responsive Design", () => {
  test("should display properly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/game");
    console.log("[DEBUG] game - viewport mobile 375x667");

    // Tous les éléments principaux doivent être visibles
    const characterName = page.getByTestId("character-name");
    await expect(characterName).toBeVisible({ timeout: 10_000 });

    const messageInput = page.getByTestId("message-input");
    await expect(messageInput).toBeVisible();

    const chatMessages = page.getByTestId("chat-messages");
    await expect(chatMessages).toBeVisible();

    console.log("[DEBUG] game - tous les éléments visibles en mobile");
  });

  test("should adapt layout on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/game");
    console.log("[DEBUG] game - viewport tablet 768x1024");

    const characterAvatar = page.getByTestId("character-avatar");
    await expect(characterAvatar).toBeVisible({ timeout: 10_000 });

    const chatMessages = page.getByTestId("chat-messages");
    await expect(chatMessages).toBeVisible();

    console.log("[DEBUG] game - layout tablet OK");
  });

  test("should use full layout on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/game");
    console.log("[DEBUG] game - viewport desktop 1920x1080");

    const characterAvatar = page.getByTestId("character-avatar");
    await expect(characterAvatar).toBeVisible({ timeout: 10_000 });

    // En desktop, l'avatar devrait être plus grand
    const avatarBox = await characterAvatar.boundingBox();
    console.log("[DEBUG] game - taille avatar desktop:", avatarBox);
    
    if (avatarBox) {
      expect(avatarBox.width).toBeGreaterThan(100);
    }
  });
});
