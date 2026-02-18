'use client';

import React, { useState, useRef, useEffect, FormEvent, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { Snackbar } from '@/shared/components/ui/Snackbar';
import { GameState, ChatMessage } from '@/shared/types';
import { playTurn } from '@/features/game/actions/game-actions';
import { StoryProgress } from '@/features/game/components/StoryProgress';
import { GameHeader } from '@/features/game/components/GameHeader';
import { CharacterAvatar } from '@/features/game/components/CharacterAvatar';
import { ChatMessages } from '@/features/game/components/ChatMessages';
import { ChatInput } from '@/features/game/components/ChatInput';
import { GameOverOverlay } from '@/features/game/components/GameOverOverlay';
import { useStoryProgression } from '@/features/game/hooks/useStoryProgression';
import { StoryLevel } from '@/features/game/types';
import { useLanguage } from '@/shared/providers/LanguageContext';
import { 
  trackGameStart, 
  trackMessageSent, 
  trackGameEnd,
  trackSecretWordUsed
} from '@/features/analytics/events';

function ImmersiveRPGContent() {
  const searchParams = useSearchParams();
  const levelId = searchParams.get('levelId');
  const { levels, completeLevel } = useStoryProgression();
  const { t, language, setLanguage } = useLanguage();
  
  const currentLevel: StoryLevel | undefined = levels.find(l => l.id === levelId) || levels[0];
  const character = currentLevel?.content?.character || 'Hermione Granger';
  const isHermione = character.toLowerCase().includes('hermione');
  const isHagrid = character.toLowerCase().includes('hagrid');
  const isRon = character.toLowerCase().includes('ron');
  const isLuna = character.toLowerCase().includes('luna');
  
  const characterFolder = isRon ? 'ron' : isLuna ? 'luna' : isHermione ? 'hermione' : 'hagrid';
  const imageExt = (isRon || isLuna) ? 'png' : 'jpg';
  
  const initialMessage = currentLevel?.content?.initial_message || 
    (isHagrid ? t('rpg.hagrid.initialMessage') : t('rpg.hermione.initialMessage'));
  
  const initialMood = (currentLevel?.content?.initial_mood || (isHagrid ? 'nervous' : 'sad')) as 'sad' | 'angry' | 'neutral' | 'happy' | 'desperate' | 'nervous';
  
  const defaultSuggestions = isHagrid 
    ? (language === 'fr' 
      ? ["Que cachez-vous ?", "Je peux vous aider ?", "Vous semblez nerveux...", "Belle journée n'est-ce pas ?"]
      : ["What are you hiding?", "Can I help you?", "You seem nervous...", "Nice day, isn't it?"])
    : (language === 'fr'
      ? ["Qu'est ce qui ne va pas ?", "Lui rappeler Harry et Ron", "Lui offrir une écoute attentive", "Bloquer le passage"]
      : ["What's wrong?", "Remind her of Harry and Ron", "Offer her attentive listening", "Block the passage"]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [turnNumber, setTurnNumber] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    character_reply: '',
    mood: initialMood,
    departure_risk: 50,
    game_over: false,
    game_won: false,
    suggested_actions: currentLevel?.content?.suggested_actions || defaultSuggestions
  });
  const [isPending, startTransition] = useTransition();
  const [inputText, setInputText] = useState('');
  const [showGrimoire, setShowGrimoire] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { snackbar, showSnackbar } = useSnackbar();
  
  const gameStartTime = useRef<number | null>(null);
  const hasTrackedStart = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: initialMessage }]);
    setTurnNumber(0);
    hasTrackedStart.current = false;
    gameStartTime.current = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);
  
  useEffect(() => {
    if (!hasTrackedStart.current && currentLevel) {
      trackGameStart(currentLevel.id, currentLevel.title, character);
      gameStartTime.current = Date.now();
      hasTrackedStart.current = true;
    }
  }, [currentLevel, character]);

  useEffect(() => {
    const imagesToPreload = [
      `/${characterFolder}/neutral.${imageExt}`,
      `/${characterFolder}/sad.${imageExt}`,
      `/${characterFolder}/angry.${imageExt}`,
      `/${characterFolder}/happy.${imageExt}`,
      `/${characterFolder}/desperate.${imageExt}`
    ];
    
    imagesToPreload.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, [characterFolder, imageExt]);

  const handleSendMessage = async (e?: FormEvent, forcedText?: string) => {
    e?.preventDefault();
    const userMessage = forcedText || inputText;

    if (!userMessage.trim() || isPending || gameState.game_over || gameState.game_won) return;

    setInputText('');
    const currentTurn = turnNumber + 1;
    setTurnNumber(currentTurn);
    
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    startTransition(async () => {
      try {
        const data = await playTurn(newMessages.map(m => ({ role: m.role, content: m.content })), language, currentTurn);

        if (currentLevel) {
          trackMessageSent(currentLevel.id, currentTurn, userMessage.length, data.departure_risk);
        }

        setGameState(data);

        if (data.character_reply) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.character_reply }]);
        }

        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('youpi') || lowerMsg.includes('yay')) {
          trackSecretWordUsed('youpi', 'instant_victory');
        } else if (lowerMsg.includes('moldu') || lowerMsg.includes('muggle')) {
          trackSecretWordUsed('moldu', 'instant_defeat');
        }

        if (data.game_won) {
          if (currentLevel && gameStartTime.current) {
            const duration = Math.round((Date.now() - gameStartTime.current) / 1000);
            trackGameEnd(currentLevel.id, currentLevel.title, character, 'victory', currentTurn, data.departure_risk, duration);
          }
          
          if (currentLevel?.id) {
            completeLevel(currentLevel.id);
          }
          const victoryMsg = isHagrid ? t('rpg.hagrid.victorySnackbar') : t('rpg.hermione.victorySnackbar');
          showSnackbar(`${t('rpg.victory')} - ${character} ${victoryMsg} !`, "success");
        } else if (data.game_over) {
          if (currentLevel && gameStartTime.current) {
            const duration = Math.round((Date.now() - gameStartTime.current) / 1000);
            const defeatReason = lowerMsg.includes('moldu') || lowerMsg.includes('muggle') 
              ? 'muggle_insult' 
              : currentTurn >= 10 
              ? 'max_turns' 
              : 'normal';
            
            trackGameEnd(currentLevel.id, currentLevel.title, character, 'defeat', currentTurn, data.departure_risk, duration, defeatReason);
          }
          
          const gameOverMsg = isHagrid ? t('rpg.hagrid.gameOverSnackbar') : t('rpg.hermione.gameOverSnackbar');
          showSnackbar(`${t('rpg.gameOver')} - ${character} ${gameOverMsg}.`, "error");
        }

      } catch (_error) {
        showSnackbar(language === 'fr' ? "Une erreur magique est survenue..." : "A magical error occurred...", "error");
      }
    });
  };

  let moodImage = `/${characterFolder}/neutral.${imageExt}`;
  switch (gameState.mood) {
    case 'sad':
    case 'nervous': 
      moodImage = `/${characterFolder}/sad.${imageExt}`; 
      break;
    case 'angry': 
      moodImage = `/${characterFolder}/angry.${imageExt}`; 
      break;
    case 'happy': 
      moodImage = `/${characterFolder}/happy.${imageExt}`; 
      break;
    case 'desperate': 
      moodImage = `/${characterFolder}/desperate.${imageExt}`; 
      break;
    default: 
      moodImage = `/${characterFolder}/neutral.${imageExt}`;
  }

  return (
    <div className="h-[calc(100vh-9rem)] text-[#E6D5A7] relative overflow-hidden flex flex-col" style={{ fontFamily: 'var(--font-merriweather)' }}>
      <GameHeader
        currentLevel={currentLevel}
        character={character}
        isHagrid={isHagrid}
        language={language}
        setLanguage={setLanguage}
        setShowGrimoire={setShowGrimoire}
        t={t}
      />

      <main className="relative z-10 flex-1 flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto w-full overflow-hidden">
        <CharacterAvatar
          character={character}
          moodImage={moodImage}
          mood={gameState.mood}
          isHagrid={isHagrid}
          turnNumber={turnNumber}
          language={language}
          t={t}
        />

        <div className="md:w-2/3 flex flex-col bg-[#141B2D]/80 rounded-xl border-2 border-[#3A2F1E] backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden relative">
          <ChatMessages
            messages={messages}
            isPending={isPending}
            messagesEndRef={messagesEndRef}
          />

          <GameOverOverlay
            gameWon={gameState.game_won}
            gameOver={gameState.game_over}
            isHagrid={isHagrid}
            currentLevel={currentLevel}
            levels={levels}
            language={language}
            t={t}
          />

          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={handleSendMessage}
            isPending={isPending}
            gameOver={gameState.game_over}
            gameWon={gameState.game_won}
            suggestedActions={gameState.suggested_actions}
            character={character}
            t={t}
          />
        </div>
      </main>

      {showGrimoire && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#141B2D] border-4 border-[#C9A227] rounded-xl shadow-[0_16px_64px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-in">
            <button
              onClick={() => setShowGrimoire(false)}
              className="absolute top-4 right-4 z-10 text-[#B8A77E] hover:text-[#E6D5A7] bg-[#6B4F2F] hover:bg-[#8C6A3F] rounded-full p-2 transition-all border-2 border-[#3A2F1E] hover:border-[#C9A227]"
            >
              ✕
            </button>
            <div className="p-6">
              <StoryProgress />
            </div>
          </div>
        </div>
      )}

      <Snackbar {...snackbar} />
    </div>
  );
}

function LoadingFallback() {
  const { t } = useLanguage();
  return (
    <div className="h-[calc(100vh-9rem)] text-[#E6D5A7] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#C9A227] mx-auto mb-4 shadow-[0_0_24px_rgba(201,162,39,0.3)]"></div>
        <p className="text-[#B8A77E] font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>{t('rpg.loading')}</p>
      </div>
    </div>
  );
}

export default function ImmersiveRPG() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ImmersiveRPGContent />
    </Suspense>
  );
}
