/**
 * =============================================================================
 * SERVICE OPENAI
 * =============================================================================
 * 
 * Service centralisé pour les appels à l'API OpenAI.
 * Gère l'authentification, la configuration et les requêtes vers GPT.
 * 
 * RESPONSABILITÉS :
 * - Validation de la clé API OpenAI
 * - Configuration du client OpenAI
 * - Création de chat completions
 * 
 * SÉCURITÉ :
 * - La clé API est stockée dans les variables d'environnement (.env.local)
 * - Validation stricte avant chaque requête
 * - Gestion des erreurs explicite
 * 
 * UTILISATION :
 * ```typescript
 * const response = await OpenAIService.createChatCompletion([
 *   { role: 'user', content: 'Hello!' }
 * ]);
 * ```
 * 
 * NOTE : Ce service est principalement utilisé côté client.
 * Pour les appels serveur, préférer les Server Actions dans game-actions.ts
 * =============================================================================
 */

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

// ============================================================================
// CLASSE SERVICE OPENAI
// ============================================================================

export class OpenAIService {
  /**
   * Récupère et valide la clé API OpenAI depuis les variables d'environnement
   * 
   * SÉCURITÉ :
   * - Vérifie que la clé existe
   * - Vérifie que ce n'est pas la valeur par défaut du template
   * 
   * @returns La clé API OpenAI validée
   * @throws Error si la clé n'est pas configurée
   * 
   * @private
   */
  private static getApiKey(): string {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;
    
    // Validation : clé manquante ou valeur par défaut
    if (!apiKey || apiKey === 'your-api-key-here') {
      throw new Error('OpenAI API key is not configured. Please add your API key to .env.local');
    }
    
    return apiKey;
  }

  /**
   * Crée une chat completion avec OpenAI GPT
   * 
   * CONFIGURATION :
   * - Modèle : GPT-3.5 Turbo (rapide et économique)
   * - dangerouslyAllowBrowser : true (pour utilisation côté client)
   * 
   * WARNING : L'option dangerouslyAllowBrowser expose la clé API côté client.
   * À n'utiliser QUE dans un environnement de développement ou avec des
   * contrôles d'authentification appropriés.
   * 
   * POUR LA PRODUCTION : Préférer des Server Actions qui gardent la clé
   * API côté serveur (voir game-actions.ts)
   * 
   * @param messages - Historique des messages de la conversation
   * @returns La réponse de l'API OpenAI
   * @throws Error si la requête échoue
   * 
   * @example
   * ```typescript
   * const response = await OpenAIService.createChatCompletion([
   *   { role: 'system', content: 'Tu es un assistant utile' },
   *   { role: 'user', content: 'Bonjour !' }
   * ]);
   * ```
   */
  static async createChatCompletion(messages: ChatCompletionMessageParam[]) {
    // Récupération et validation de la clé API
    const apiKey = this.getApiKey();
    
    // Initialisation du client OpenAI
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // ⚠️ À utiliser avec précaution
    });

    // Appel à l'API OpenAI
    return await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Modèle rapide pour chat général
      messages: messages,
    });
  }
}

